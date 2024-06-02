const express = require('express')
const router = express.Router()
const connection = require('../dbconnection')

router.get('/posts', async (req, res) => {
  const posts = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT p.*,
      COUNT(DISTINCT pl.userId) AS likeCount48h,
      COUNT(DISTINCT c.id) AS commentCount48h
      FROM post p
      LEFT JOIN post_like pl ON p.id = pl.postId AND pl.createAt >= NOW() - INTERVAL 48 HOUR
      LEFT JOIN comment c ON p.id = c.postId AND c.createAt >= NOW() - INTERVAL 48 HOUR
      GROUP BY p.id
      ORDER BY likeCount48h DESC, commentCount48h DESC
      LIMIT 5;`,
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
  const authors = authorIds.length
    ? await new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM user WHERE id IN (${authorIds.map((id) => `${id}`).join(', ')})`,
          (err, results) => {
            if (err) {
              reject(err)
            } else {
              resolve(results.map((user) => ({ ...user, password: undefined })))
            }
          },
        )
      })
    : []
  const authorMap = authors.reduce((acc, author) => {
    acc[author.id] = author
    return acc
  }, {})
  posts.forEach((post) => {
    post.author = authorMap[post.userId]
  })

  res.status(200).json(posts)
})

module.exports = router
