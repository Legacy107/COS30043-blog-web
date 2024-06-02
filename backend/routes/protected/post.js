const express = require('express')
const router = express.Router()
const connection = require('../../dbconnection')
const { Formidable } = require('formidable')
const { put } = require('@vercel/blob')
const { Writable } = require('stream')

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
  const topicIds = fields?.topics?.[0]?.split(',')?.filter((x) => x) ?? []
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
      `INSERT INTO post (title, description, content, image, userId) VALUES (?, ?, ?, ?, ?)`,
      [title, description, content, url, req.userId],
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

  if (topicIds?.length) {
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
  let updateQuery = `SET title=${connection.escape(title)}, description=${connection.escape(description)}, content=${connection.escape(content)}`
  if (url) {
    updateQuery += `, image=${connection.escape(url)}`
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
  if (newTopics?.length) {
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
  if (deleteTopics?.length) {
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
      `INSERT INTO comment (postId, userId, content) VALUES (?, ?, ?)`,
      [postId, req.userId, content],
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
