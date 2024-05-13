const express = require('express')
const router = express.Router()
const connection = require('../../dbconnection')

router.post('/:id/like', async (req, res) => {
  const commentId = req.params.id

  await new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO comment_like (commentId, userId) VALUES (${commentId}, ${req.userId})`,
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
      `UPDATE comment SET likes = likes + 1 WHERE id=${commentId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  res.status(201).json({ message: 'Comment liked' })
})

router.delete('/:id/like', async (req, res) => {
  const commentId = req.params.id

  await new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM comment_like WHERE commentId=${commentId} AND userId=${req.userId}`,
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
      `UPDATE comment SET likes = likes - 1 WHERE id=${commentId}`,
      (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      },
    )
  })

  res.status(200).json({ message: 'Comment unliked' })
})

module.exports = router
