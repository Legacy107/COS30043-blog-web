const express = require('express')
const router = express.Router()
const connection = require('../../dbconnection')
const authenticateToken = require('../../middleware/authMiddleware')

router.get('/topics', authenticateToken, async (req, res) => {
  // return first 10 topics order by name
  const topics = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT topic.*, t.like_count FROM topic JOIN (' +
        'SELECT topicId, COUNT(*) as like_count ' +
        'FROM post_topic JOIN post_like ' +
        'ON post_topic.postId = post_like.postId ' +
        `WHERE post_like.userId = ${req.userId} ` +
        'GROUP BY topicId ' +
        ') as t ' +
        'ON topic.id = t.topicId ' +
        'ORDER BY like_count DESC LIMIT 10',
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  const notInQuery = topics?.length
    ? `WHERE id NOT IN (${topics.map((topic) => topic.id).join(', ')})`
    : ''

  // get remaining topics if less than 10
  if (topics.length < 10) {
    const remainingTopics = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM topic ${notInQuery} ORDER BY name ASC LIMIT ${
          10 - topics.length
        }`,
        (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        },
      )
    })

    topics.push(...remainingTopics)
  }

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
          resolve(results.map((user) => ({ ...user, password: undefined })))
        }
      },
    )
  })

  res.status(200).json(users)
})

module.exports = router
