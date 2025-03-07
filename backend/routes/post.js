const express = require('express')
const router = express.Router()
const connection = require('../dbconnection')
const tokenMiddleware = require('../middleware/tokenMiddleware')

router.get('/', tokenMiddleware, async (req, res) => {
  try {
    const {
      search,
      offset = 0,
      limit = 10,
      sort = 'Newest',
      userId,
    } = req.query
    const searchQuery = search
      ? `title LIKE ${connection.escape('%' + search + '%')}`
      : ''
    const topics = req.query.topics ? req.query.topics.split(',') : []

    const following = req.userId ? req.query.following === 'true' : false
    const followingTopicIds =
      !following || following === 'false'
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
              `SELECT id FROM topic WHERE name IN (${topics.map((topic) => `"${topic}"`).join(', ')})`,
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
        ).map((user) => user.userId)
    if (userId) {
      followingUserIds.push(userId)
    }
    const authorQuery = followingUserIds.length
      ? `userId IN (${followingUserIds.map((userId) => `${userId}`).join(', ')})`
      : following
        ? 'userId IN []'
        : ''

    let whereQuery = [searchQuery, topicQuery, authorQuery]
      .filter((query) => query)
      .join(' AND ')
    whereQuery = whereQuery ? `WHERE ${whereQuery}` : ''

    const sortQuery =
      sort === 'Newest'
        ? `ORDER BY createAt DESC, id ASC`
        : sort === 'Most liked'
          ? `ORDER BY likes DESC, createAt DESC, id ASC`
          : `ORDER BY comments DESC, createAt DESC, id ASC`

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
            resolve(results.map((user) => ({ ...user, password: undefined })))
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

    // get count if for a user
    let total = 0
    if (userId) {
      total = await new Promise((resolve, reject) => {
        connection.query(
          `SELECT COUNT(*) as count FROM post WHERE userId=${userId}`,
          (err, results) => {
            if (err) {
              reject(err)
            } else {
              resolve(results[0].count)
            }
          },
        )
      })
    }

    res.status(200).json({
      posts,
      total,
    })
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
            resolve({
              ...results[0],
              password: undefined,
            })
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
      post.topics = await new Promise((resolve, reject) => {
        connection.query(
          `SELECT id, name FROM topic WHERE id IN (${topicIds.map((id) => `${id}`).join(', ')})`,
          (err, results) => {
            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          },
        )
      })
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
              resolve(results.map((user) => ({ ...user, password: undefined })))
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
