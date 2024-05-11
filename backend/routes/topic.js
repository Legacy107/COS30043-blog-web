const express = require('express')
const router = express.Router()
const connection = require('../dbconnection')

// CREATE TABLE `topic` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `name` varchar(100) NOT NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `name_UNIQUE` (`name`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

router.get('/', async (req, res) => {
  try {
    const topics = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM topic', (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })

    res.status(200).json(topics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
