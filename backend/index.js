require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connection = require('./dbconnection')
const authenticateToken = require('./middleware/authMiddleware')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')
const protectedPostRoutes = require('./routes/protected/post')
const protectedCommentRoutes = require('./routes/protected/comment')
const userRoutes = require('./routes/user')
const protectedUserRoutes = require('./routes/protected/user')
const topicRoutes = require('./routes/topic')
const recommendationRoutes = require('./routes/protected/recommendation')

const app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', authRoutes)
app.use('/post', postRoutes)
app.use('/post', authenticateToken, protectedPostRoutes)
app.use('/comment', authenticateToken, protectedCommentRoutes)
app.use('/user', userRoutes)
app.use('/user', authenticateToken, protectedUserRoutes)
app.use('/topic', topicRoutes)
app.use('/recommendation', authenticateToken, recommendationRoutes)

app.get('/users', authenticateToken, (req, res) => {
  connection.query('SELECT * FROM user', (error, results) => {
    res.status(200).json(results)
  })
})

// Start the server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
