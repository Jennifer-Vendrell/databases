const {request, response} = require('express');
const bcrypt = require(`bcrypt`);
const usersModel = require('../models/users');
const pool = require('../db');

// primer endpoint

const listUsers = async (req = request, res = response) => {
    let conn;

    try{
        conn =  await pool.getConnection();

        const users = await conn.query(usersModel.getAll,(err)=>{
            if (err){
                throw err;
            }
        })
        res.json(users);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn){
            conn.end()
        }
    }
}


// segundo endpoint

const listUsersByID = async (req = request, res = response) => {
    const {id} = req.params;
    let conn;

    if (isNaN(id)){
        res.status(400).json ({msg: `The ID ${id} is invalid`});
        return;
    }

    try{
        conn =  await pool.getConnection();

        const [user] = await conn.query(usersModel.getByID, [id] ,(err)=>{
            if (err){
                throw err;
            }
        })

        if (!user){
            res.status(404).json({msg: `User with ID ${id} not found`});
            return;
        }

        res.json(user);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn){
            conn.end();
        }
    }
}

// tercer endpoint

const addUser = async (req = request, res = response) =>{
    const {
        usersname,
        password,
        email,
        name,
        lastname,
        phonenumber = '',
        role_id,
        is_active = 1
    } = req.body;

    if (!usersname || !password || !email || !name || !lastname || !role_id){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password,saltRounds);

    const user= 
       [usersname,
        passwordHash,
        email,
        name,
        lastname,
        phonenumber,
        role_id,
        is_active]

    let conn;

    try{
        conn = await pool.getConnection();

        const [usersnameExists] = await conn.query(usersModel.getByusersname,[usersname],(err)=>{
            if (err) throw err;
        })
        if (usersnameExists){
            res.status(409).json({msg: `Usersname ${usersname} already exists`});
            return;
        }

        const [emailExists] = await conn.query(usersModel.getByEmail,[email],(err)=>{
            if (err) throw err;
        })
        if (emailExists){
            res.status(409).json({msg: `Email ${email} already exists`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow,[...user], (err)=>{
            if (err) throw err;
        })

        if (userAdded.affectedRows === 0){
            throw new Error('User not Added');
        }
        
        res.json({msg: 'User added succesfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}

// cuarto endpoitn Aqui va la para actualizar un usuario si existe
const updateUser = async (req = request, res = response) => {
    let conn;

    const {
        usersname,
        password,
        email,
        name,
        lastname,
        phonenumber,
        role_id,
        is_active
    } = req.body;

    const { id } = req.params;

    let passwordHash;
    if (password){
    const saltRounds = 10;
     passwordHash = await bcrypt.hash(password, saltRounds);
}

    let userNewData = [
        usersname,
        passwordHash,
        email,
        name,
        lastname,
        phonenumber,
        role_id,
        is_active
    ];

    try {
        conn = await pool.getConnection();

const [usersExists] = await conn.query
(usersModel.getByID, 
    [id], 
    (err) => {
    if (err) throw err;
});

if (!usersExists || usersExists.is_active ===0){
    res.status(409).json({msg: `User with ID ${id} not found`});
         return;
}

const [usersnameExists] = await conn.query(usersModel.getByUsersname, [usersname], (err) => {
    if (err) throw err;
    })
    if (usersnameExists) {
        res.status(409).json({msg: `Username ${usersname} already exists`});
        return;
       }

const [emailExists] = await conn.query(usersModel.getByEmail, [email], (err) => {
      if (err) throw err;
     })
      if (emailExists) {
          res.status(409).json({msg: `Email ${email} already exists`});
         return;
           }

        const userOldData = [
        usersExists.usersname,
        usersExists.password,
        usersExists.email,
        usersExists.name,
        usersExists.lastname,
        usersExists.phonenumber,
        usersExists.role_id,
        usersExists.is_active     
      ];

      userNewData.forEach((userData, index) =>{
        if (!userData){
            userNewData[index] = userOldData[index];
        }
      })
           const usersUpdated = await conn.query(
            usersModel.updateRow,
            [...userNewData, id],
            (err) =>{
                if (err) throw err;
            }
           )

 if (usersUpdated.affecteRows === 0){
   throw new Error('User not added')
        } 

        res.json({msg: 'USER UPDATED SECCESFULLY'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    } finally {
        if (conn) conn.end();
    }
}
// quinto endpoitn 

const deleteUser = async (req = request, res = response) =>{
    let conn;
    const {id} = req.params;

    try{
        conn = await pool.getConnection();
        const [usersExists] = await conn.query(usersModel.getByID,[id], (err) =>{
            if (err) throw err;
        });
        if (!usersExists || usersExists.is_active === 0){
            res.status(404).json({msg: `User with ID ${id} not found`});
            return;
        }
        const usersDeleted = await conn.query(usersModel.deleteRow,[id],(err) =>{
            if (err) throw err;
        });
        
        if (usersDeleted.affectedRows === 0){
            throw new Error('User not deleted');
        }

        res.json({msg:'User deleted succesfully'});

    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally {
        if (conn) conn.end();
    }
}


// sexto endpoint inicio de sesion 

const signInUser = async (req = request, res = response)=> {
    let conn;

    const {usersname, password} = req.body;

    conn = await pool.getConnection();

    try {

        
    if (!usersname || !password){
        res.status(404).json({msg: `you must send usersname and password`});
        return;
    }

    const [user] = await conn.query(
        usersModel.getByUsersname,
        [usersname],
        (error)=>{
            if (error) throw err;}
            );
        
            if (!user){res.status(400).json({msg: `WHONG USERNAME OR PASSWORD`});
                return;
            }



    const password = await bcrypt.compare(password, user.password);
    if (!password){
        res.status(400).json({msg: `WHONG USERNAME OR PASSWORD`});
        return;
    }

    delete(user.password);
    delete(user.create_at);
    delete(user.updated_at);

    res.json(user);
    
    }catch (error){
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn)conn.end();
    }
}





module.exports = {listUsers, listUsersByID, addUser, updateUser ,deleteUser, signInUser}

// routes       controllers       models(DB)