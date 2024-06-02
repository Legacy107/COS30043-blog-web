const express = require('express')
const router = express.Router()
const connection = require('../../dbconnection')
const { Formidable } = require('formidable')
const { put } = require('@vercel/blob')
const { Writable } = require('stream')

router.post('/:id/follow', async (req, res) => {
  const { id } = req.params
  if (req.userId === id) {
    return res.status(400).json({ message: 'You cannot follow yourself' })
  }
  try {
    await new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO user_follow (followerId, userId) VALUES (${req.userId}, ${id})`,
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
        `UPDATE user SET followers = followers + 1 WHERE id=${id}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })
    res.status(200).json({ message: 'User followed' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.delete('/:id/follow', async (req, res) => {
  const { id } = req.params
  if (req.userId === id) {
    return res.status(400).json({ message: 'You cannot unfollow yourself' })
  }
  try {
    await new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM user_follow WHERE followerId=${req.userId} AND userId=${id}`,
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
        `UPDATE user SET followers = followers - 1 WHERE id=${id}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })
    res.status(200).json({ message: 'User unfollowed' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

const fileConsumer = (acc) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk)
      next()
    },
  })

  return writable
}

router.put('/', async (req, res) => {
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
  const firstname = fields?.firstname?.[0]
  const lastname = fields?.lastname?.[0]
  const bio = fields?.bio?.[0]
  const avatar = files?.avatar?.[0]
  const avatarData = Buffer.concat(chunks)

  let url = ''
  if (avatar) {
    const name = `${new Date().getTime()}-${req.userId}-${avatar.originalFilename}`
    url = (
      await put(name, avatarData, {
        access: 'public',
      })
    ).url
  }

  let updateQuery = `SET firstname=${connection.escape(firstname)}, lastname=${connection.escape(lastname)}, bio=${connection.escape(bio)}`
  if (url) {
    updateQuery += `, avatar=${connection.escape(url)}`
  }

  try {
    await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user ${updateQuery} WHERE id=${req.userId}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })
    const user = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE id=${req.userId}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results?.[0])
          }
        },
      )
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      ...user,
      password: undefined,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
