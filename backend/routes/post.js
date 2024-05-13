const express = require('express')
const router = express.Router()
const connection = require('../dbconnection')
const tokenMiddleware = require('../middleware/tokenMiddleware')

// CREATE TABLE `post` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `title` varchar(100) NOT NULL,
//   `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `description` varchar(300) NOT NULL,
//   `content` mediumtext NOT NULL,
//   `userId` int NOT NULL,
//   `likes` int NOT NULL DEFAULT '0',
//   `comments` int NOT NULL DEFAULT '0',
//   `image` varchar(200) DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `post-userId_idx` (`userId`),
//   CONSTRAINT `post-userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `topic` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `name` varchar(100) NOT NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `name_UNIQUE` (`name`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `post_topic` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `postId` int NOT NULL,
//   `topicId` int NOT NULL,
//   PRIMARY KEY (`id`),
//   KEY `post_topic_postId_idx` (`postId`),
//   KEY `post_topic_topicId_idx` (`topicId`),
//   CONSTRAINT `post_topic_postId` FOREIGN KEY (`postId`) REFERENCES `post` (`id`),
//   CONSTRAINT `post_topic_topicId` FOREIGN KEY (`topicId`) REFERENCES `topic` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

router.get('/', async (req, res) => {
  try {
    const {
      search,
      offset = 0,
      limit = 10,
      following,
      sort,
      userId,
    } = req.query
    const searchQuery = search ? `title LIKE '%${search}%'` : ''
    const topics = req.query.topics ? req.query.topics.split(',') : []
    const followingTopicIds = !following
      ? []
      : (
          await new Promise((resolve, reject) => {
            connection.query(
              `SELECT topicId FROM user_topic WHERE userId = ${req.userId}`,
              (err, results) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(results)
                }
              },
            )
          })
        ).map((topic) => topic.topicId)

    const topicIds = !topics.length
      ? []
      : (
          await new Promise((resolve, reject) => {
            connection.query(
              `SELECT id FROM topic WHERE name IN (${topics.map((topic) => `${topic}`).join(', ')})`,
              (err, results) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(results)
                }
              },
            )
          })
        ).map((topic) => topic.id)
    topicIds.push(...followingTopicIds)
    const topicQuery = !topicIds.length
      ? ''
      : `id IN (
      SELECT postId FROM post_topic WHERE topicId IN (${topicIds.map((topicId) => `${topicId}`).join(', ')})
    )`

    const followingUserIds = !following
      ? []
      : (
          await new Promise((resolve, reject) => {
            connection.query(
              `SELECT userId FROM user_follow WHERE followerId = ${req.userId}`,
              (err, results) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(results)
                }
              },
            )
          })
        ).map((topic) => topic.topicId)
    if (userId) {
      followingUserIds.push(userId)
    }
    const authorQuery = followingUserIds.length
      ? `userId IN (${followingUserIds.map((userId) => `${userId}`).join(', ')})`
      : ''

    let whereQuery = [searchQuery, topicQuery, authorQuery]
      .filter((query) => query)
      .join(' AND ')
    whereQuery = whereQuery ? `WHERE ${whereQuery}` : ''

    const sortQuery =
      sort === 'Newest' ? `ORDER BY createAt DESC` : `ORDER BY likes DESC`

    const query = `
      SELECT * FROM post ${whereQuery} ${sortQuery} LIMIT ${limit} OFFSET ${offset};
    `

    const posts = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })

    if (!posts.length) {
      return res.status(200).json(posts)
    }

    // populate author
    const authorIds = posts.map((post) => post.userId)
    const authors = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE id IN (${authorIds.map((id) => `${id}`).join(', ')})`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })
    const authorMap = authors.reduce((acc, author) => {
      acc[author.id] = author
      return acc
    }, {})
    posts.forEach((post) => {
      post.author = authorMap[post.userId]
    })

    res.status(200).json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const post = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM post WHERE id = ${id}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results[0])
          }
        },
      )
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // populate author
    const author = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE id = ${post.userId}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results[0])
          }
        },
      )
    })
    post.author = author

    // populate topics
    const topics = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT topicId FROM post_topic WHERE postId = ${id}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })
    post.topics = []
    if (topics.length) {
      const topicIds = topics.map((topic) => topic.topicId)
      const topicNames = await new Promise((resolve, reject) => {
        connection.query(
          `SELECT name FROM topic WHERE id IN (${topicIds.map((id) => `${id}`).join(', ')})`,
          (err, results) => {
            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          },
        )
      })
      post.topics = topicNames.map((topic) => topic.name)
    }

    res.status(200).json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/:id/comments', tokenMiddleware, async (req, res) => {
  const postId = req.params.id
  const { sort } = req.query

  const sortQuery =
    sort === 'Newest'
      ? 'ORDER BY createAt DESC'
      : sort === 'Oldest'
        ? 'ORDER BY createAt ASC'
        : 'ORDER BY likes DESC'

  const comments = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM comment WHERE postId=${postId} ${sortQuery}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  // populate the user field in the comments
  const userIds = comments.map((post) => post.userId)
  const users = userIds.length
    ? await new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM user WHERE id IN (${userIds.map((id) => `${id}`).join(', ')})`,
          (err, results) => {
            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          },
        )
      })
    : []
  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})
  comments.forEach((comment) => {
    comment.user = userMap[comment.userId]
  })

  // populate the isLikes field in the comments
  if (req.userId) {
    const commentIds = comments.map((comment) => comment.id)
    const likes = commentIds.length
      ? await new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM comment_like WHERE commentId IN (${commentIds.map((id) => `${id}`).join(', ')}) AND userId=${req.userId}`,
            (err, results) => {
              if (err) {
                reject(err)
              } else {
                resolve(results)
              }
            },
          )
        })
      : []
    const likeMap = likes.reduce((acc, like) => {
      acc[like.commentId] = true
      return acc
    }, {})
    comments.forEach((comment) => {
      comment.liked = likeMap[comment.id] ? true : false
    })
  } else {
    comments.forEach((comment) => {
      comment.liked = false
    })
  }

  res.status(200).json(comments)
})

module.exports = router
