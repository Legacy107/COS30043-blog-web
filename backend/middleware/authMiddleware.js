const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')
  if (!token) return res.status(401).json({ error: 'Access denied' })
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authenticateToken
