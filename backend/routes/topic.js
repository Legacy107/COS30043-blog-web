const express = require('express')
const router = express.Router()
const connection = require('../dbconnection')

router.get('/', async (req, res) => {
  try {
    const { search, limit } = req.query
    const searchQuery = search?.length
      ? `WHERE name LIKE ${connection.escape('%' + search + '%')}`
      : ''
    const limitQuery = limit ? `LIMIT ${limit}` : ''

    const topics = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM topic ${searchQuery} ORDER BY name ASC ${limitQuery}`,
        (error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        },
      )
    })

    res.status(200).json(topics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
