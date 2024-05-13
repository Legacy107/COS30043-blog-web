const express = require('express')
const router = express.Router()
const connection = require('../../dbconnection')

// CREATE TABLE `post` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `title` varchar(100) NOT NULL,
//   `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `description` varchar(300) NOT NULL,
//   `content` mediumtext NOT NULL,
//   `userId` int NOT NULL,
//   `likes` int NOT NULL DEFAULT '0',
//   `comments` int NOT NULL DEFAULT '0',
//   `image` varchar(200) DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `post-userId_idx` (`userId`),
//   CONSTRAINT `post-userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `topic` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `name` varchar(100) NOT NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `name_UNIQUE` (`name`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// CREATE TABLE `post_topic` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `postId` int NOT NULL,
//   `topicId` int NOT NULL,
//   PRIMARY KEY (`id`),
//   KEY `post_topic_postId_idx` (`postId`),
//   KEY `post_topic_topicId_idx` (`topicId`),
//   CONSTRAINT `post_topic_postId` FOREIGN KEY (`postId`) REFERENCES `post` (`id`),
//   CONSTRAINT `post_topic_topicId` FOREIGN KEY (`topicId`) REFERENCES `topic` (`id`)
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

router.get('/posts', async (req, res) => {
  // return first 5 posts order by likes and comments
  const posts = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM post ORDER BY likes DESC, comments DESC LIMIT 5`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  // populate author
  const authorIds = posts.map((post) => post.userId)
  const authors = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM user WHERE id IN (${authorIds.map((id) => `${id}`).join(', ')})`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })
  const authorMap = authors.reduce((acc, author) => {
    acc[author.id] = author
    return acc
  }, {})
  posts.forEach((post) => {
    post.author = authorMap[post.userId]
  })

  res.status(200).json(posts)
})

router.get('/topics', async (req, res) => {
  // return first 10 topics order by name
  const topics = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM topic ORDER BY name LIMIT 10`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  res.status(200).json(topics)
})

router.get('/users', async (req, res) => {
  // return first 5 users order by followers
  const users = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM user ORDER BY followers DESC LIMIT 5`,
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
})

module.exports = router
