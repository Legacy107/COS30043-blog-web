const express = require('express')
const router = express.Router()
const connection = require('../../dbconnection')
const { Formidable } = require('formidable')
const { put } = require('@vercel/blob')
const { Writable } = require('stream')

// CREATE TABLE `post_like` (
//   `postId` int NOT NULL,
//   `userId` int NOT NULL,
//   `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`postId`,`userId`),
//   KEY `postId_idx` (`postId`),
//   KEY `userId_idx` (`userId`),
//   CONSTRAINT `like-postId` FOREIGN KEY (`postId`) REFERENCES `post` (`id`),
//   CONSTRAINT `like-userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `post` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `title` varchar(100) NOT NULL,
//   `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `description` varchar(300) NOT NULL,
//   `content` mediumtext NOT NULL,
//   `userId` int NOT NULL,
//   `likes` int NOT NULL DEFAULT '0',
//   `comments` int NOT NULL DEFAULT '0',
//   PRIMARY KEY (`id`),
//   KEY `post-userId_idx` (`userId`),
//   CONSTRAINT `post-userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `comment` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `postId` int NOT NULL,
//   `userId` int NOT NULL,
//   `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `likes` int NOT NULL DEFAULT '0',
//   PRIMARY KEY (`id`),
//   KEY `postId_idx` (`postId`),
//   KEY `userId_idx` (`userId`),
//   CONSTRAINT `comment-postId` FOREIGN KEY (`postId`) REFERENCES `post` (`id`),
//   CONSTRAINT `comment-userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `comment_like` (
//   `commentId` int NOT NULL,
//   `userId` int NOT NULL,
//   `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`commentId`,`userId`),
//   KEY `comment_like_userId_idx` (`userId`),
//   CONSTRAINT `comment_like_commentId` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`),
//   CONSTRAINT `comment_like_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

const fileConsumer = (acc) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk)
      next()
    },
  })

  return writable
}

async function extractPostFormData(req) {
  const chunks = []
  const form = new Formidable({
    fileWriteStreamHandler: () => fileConsumer(chunks),
  })
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  const title = fields?.title?.[0]
  const description = fields?.description?.[0]
  const content = fields?.content?.[0]
  const topicIds = fields?.topics?.[0]?.split(',') ?? []
  const image = files?.image?.[0]
  const imageData = Buffer.concat(chunks)

  let url = ''
  if (image) {
    const name = `${new Date().getTime()}-${image.originalFilename}`
    url = (
      await put(name, imageData, {
        access: 'public',
      })
    ).url
  }
  return { title, description, content, url, topicIds }
}

router.post('/', async (req, res) => {
  const { title, description, content, url, topicIds } =
    await extractPostFormData(req)

  // insert the post in the database
  const post = await new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO post (title, description, content, image, userId) VALUES ('${title}', '${description}', '${content}', '${url}', ${req.userId})`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  // insert the topics in the database
  const topicValues = topicIds
    .map((topicId) => `(${post.insertId}, ${topicId})`)
    .join(',')

  if (topicValues) {
    await new Promise((resolve, reject) =>
      connection.query(
        `INSERT INTO post_topic (postId, topicId) VALUES ${topicValues}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      ),
    )
  }

  res.status(201).json(post)
})

router.put('/:id', async (req, res) => {
  const { title, description, content, url, topicIds } =
    await extractPostFormData(req)

  const postId = req.params.id
  const postTopics = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM post_topic WHERE postId=${postId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })
  const postTopicIds = postTopics.map((postTopic) => postTopic.topicId)

  // update the post in the database
  let updateQuery = `SET title='${title}', description='${description}', content='${content}'`
  if (url) {
    updateQuery += `, image='${url}'`
  }

  await new Promise((resolve, reject) => {
    connection.query(
      `UPDATE post ${updateQuery} WHERE id=${postId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  // insert the topics in the database
  const newTopics = topicIds
    .filter((topicId) => !postTopicIds.includes(parseInt(topicId)))
    .map((topicId) => `(${postId}, ${topicId})`)
    .join(',')
  if (newTopics) {
    await new Promise((resolve, reject) =>
      connection.query(
        `INSERT INTO post_topic (postId, topicId) VALUES ${newTopics}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      ),
    )
  }

  // delete the topics in the database
  const deleteTopics = postTopicIds
    .filter((topicId) => !topicIds.includes(topicId.toString()))
    .map((topicId) => `(${postId}, ${topicId})`)
    .join(',')
  if (deleteTopics) {
    await new Promise((resolve, reject) =>
      connection.query(
        `DELETE FROM post_topic WHERE (postId, topicId) IN (${deleteTopics})`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      ),
    )
  }

  res.status(200).json({ message: 'Post updated' })
})

router.delete('/:id', async (req, res) => {
  const postId = req.params.id

  await new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM post WHERE id=${postId} AND userId=${req.userId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  res.status(200).json({ message: 'Post deleted' })
})

router.post('/:id/like', async (req, res) => {
  const postId = req.params.id

  await new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO post_like (postId, userId) VALUES (${postId}, ${req.userId})`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  await new Promise((resolve, reject) => {
    connection.query(
      `UPDATE post SET likes = likes + 1 WHERE id=${postId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  res.status(201).json({ message: 'Post liked' })
})

router.get('/:id/like', async (req, res) => {
  // get like from this user
  const postId = req.params.id
  const like = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM post_like WHERE postId=${postId} AND userId=${req.userId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          if (results.length === 0) {
            resolve(false)
          } else resolve(true)
        }
      },
    )
  })

  res.status(200).json({ like })
})

router.delete('/:id/like', async (req, res) => {
  const postId = req.params.id

  await new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM post_like WHERE postId=${postId} AND userId=${req.userId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  await new Promise((resolve, reject) => {
    connection.query(
      `UPDATE post SET likes = likes - 1 WHERE id=${postId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  res.status(200).json({ message: 'Post unliked' })
})

router.post('/:id/comment', async (req, res) => {
  const postId = req.params.id
  const { content } = req.body

  await new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO comment (postId, userId, content) VALUES (${postId}, ${req.userId}, '${content}')`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  await new Promise((resolve, reject) => {
    connection.query(
      `UPDATE post SET comments = comments + 1 WHERE id=${postId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  res.status(201).json({ message: 'Comment added' })
})

module.exports = router
