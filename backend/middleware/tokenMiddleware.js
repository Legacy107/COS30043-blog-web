const jwt = require('jsonwebtoken')
function tokenMiddleware(req, res, next) {
  const token = req.header('Authorization')
  if (!token) next()
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    next()
  }
}

module.exports = tokenMiddleware
