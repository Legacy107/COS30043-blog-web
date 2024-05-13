const express = require('express')
const router = express.Router()
const connection = require('../dbconnection')

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

// CREATE TABLE `user` (
//   `username` varchar(45) NOT NULL,
//   `password` char(60) NOT NULL,
//   `firstname` varchar(45) NOT NULL,
//   `lastname` varchar(45) NOT NULL,
//   `id` int NOT NULL AUTO_INCREMENT,
//   `avatar` varchar(100) DEFAULT NULL,
//   `bio` varchar(2000) DEFAULT NULL,
//   `followers` int NOT NULL DEFAULT '0',
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `username_UNIQUE` (`username`)
// ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `user_follow` (
//   `followerId` int NOT NULL,
//   `userId` int NOT NULL,
//   PRIMARY KEY (`followerId`,`userId`),
//   KEY `user_follow_follower_idx` (`followerId`),
//   KEY `user_follow_user_idx` (`userId`),
//   CONSTRAINT `user_follow_follower` FOREIGN KEY (`followerId`) REFERENCES `user` (`id`),
//   CONSTRAINT `user_follow_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

router.get('/', async (req, res) => {
  try {
    const { search, offset = 0, limit = 5 } = req.query
    const searchQuery = search ? `WHERE username LIKE '%${search}%'` : ''
    const query = `SELECT * FROM user ${searchQuery} ORDER BY firstname ASC LIMIT ${limit} OFFSET ${offset}`
    const users = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
    res.status(200).json(users)
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
    res.status(200).json(users[0])
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
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
