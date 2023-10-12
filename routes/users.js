const express = require('express')
const router = express.Router();
const {listUsers, listUserByID} = require ('../controllers/users');


router.get('/', listUsers);
router.get('/:id', listUserByID);    //http://localhost:3000/api/v1/users/?
//router.post(`/`,listUsers);
//router.put(`/`,listUsers);
//router.patch(`/`,listUsers);
//router.delete(`/`,listUsers);


module.exports= router

// http://localhost:3000/api/v1/users