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

router.post('/', async (req, res) => {
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
  const topicIds = fields?.topics?.[0]
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
  const topicIdsArray = topicIds?.split(',') ?? []
  const topicValues = topicIdsArray
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

module.exports = router
