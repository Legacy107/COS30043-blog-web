const express = require('express')
const router = express.Router()
const connection = require('../dbconnection')

router.get('/', async (req, res) => {
  try {
    const { search, offset = 0, limit = 5 } = req.query
    const searchQuery = search
      ? `WHERE username LIKE ${connection.escape('%' + search + '%')}` +
        ` OR firstname LIKE ${connection.escape('%' + search + '%')}` +
        ` OR lastname LIKE ${connection.escape('%' + search + '%')}`
      : ''
    const query = `SELECT * FROM user ${searchQuery} ORDER BY firstname ASC LIMIT ${limit} OFFSET ${offset}`
    const users = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results.map((user) => ({ ...user, password: undefined })))
        }
      })
    })
    res
      .status(200)
      .json(users.map((user) => ({ ...user, password: undefined })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const users = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE id = ${id}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })
    if (!users.length) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      ...users[0],
      password: undefined,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/:id/following', async (req, res) => {
  const { id } = req.params
  try {
    const users = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT user.* FROM user_follow JOIN user ON user_follow.userId = user.id WHERE user_follow.followerId = ${id}`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })
    res
      .status(200)
      .json(users.map((user) => ({ ...user, password: undefined })))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
