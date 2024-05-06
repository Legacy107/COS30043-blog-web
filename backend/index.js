require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connection = require('./dbconnection')
const authenticateToken = require('./middleware/authMiddleware')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')

const app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', authRoutes)
app.use('/posts', authenticateToken, postRoutes)

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
