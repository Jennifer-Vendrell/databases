const express = require('express')
const router = express.Router();
const {listUsers, 
    listUsersByID,
     addUser,
      deleteUser, 
      signInUser,
      updateUser} = require ('../controllers/users');


router.get('/', listUsers);
router.get('/:id',listUsersByID); // https//localhost:3000/api/v1/users/?
router.post('/', signInUser);
router.put('/', addUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router

// http://localhost:3000/api/v1/users