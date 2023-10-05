const express = require('express')
const router = express.Router()
const listUsers = require ('../controllers/Users')

router.get('/', (req, res) => listUsers(req, res))

module.exports = router

// http://localhost:3000/api/v1/users