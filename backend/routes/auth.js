const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connection = require('../dbconnection')

router.post('/login', (req, res) => {
  const { username, password } = req.body
  connection.query(
    'SELECT * FROM user WHERE username = ?',
    [username],
    (error, results) => {
      if (results?.length === 0) {
        res.status(401).json({ message: 'Invalid username or password' })
      } else {
        const user = results[0]
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if (!passwordMatch) {
          return res
            .status(401)
            .json({ message: 'Invalid username or password' })
        }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        delete user.password
        res.status(200).json({ accessToken, user })
      }
    },
  )
})
router.post('/signup', (req, res) => {
  const { username, password, firstname, lastname } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)
  connection.query(
    'INSERT INTO user (username, password, firstname, lastname) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, firstname, lastname],
    (error) => {
      if (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
      } else {
        res.status(201).json({ message: 'User created' })
      }
    },
  )
})

module.exports = router
