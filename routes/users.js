const express = require('express')
const router = express.Router()
const listUsers = require ('../controllers/users')


router.get('/',listUsers);
//router.post(`/`,listUsers);
//router.put(`/`,listUsers);
//router.patch(`/`,listUsers);
//router.delete(`/`,listUsers);


module.exports= router

// http://localhost:3000/api/v1/users