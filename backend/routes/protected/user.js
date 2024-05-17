const express = require('express')
const router = express.Router()
const connection = require('../../dbconnection')
const { Formidable } = require('formidable')
const { put } = require('@vercel/blob')
const { Writable } = require('stream')

// CREATE TABLE `post` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `title` varchar(100) NOT NULL,
//   `createAt` datetime NOT NULL DEFAULT CURRENT_TIMES`TAMP,
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

  let updateQuery = `SET firstname="${firstname}", lastname="${lastname}", bio="${bio}"`
  if (url) {
    updateQuery += `, avatar='${url}'`
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
    res.status(200).json({ message: 'User updated' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
