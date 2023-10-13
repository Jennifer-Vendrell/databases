const{request,response} = require(`express`);
const usersModel = require(`../models/users`);
const pool = require(`../db`);


const listUsers = async (req = request, res = response) => {
let conn;

try{
    conn = await pool.getConnection();

const users = await conn.query(usersModel.getAll,(err)=> {
    if (err){   

       throw err;
    
    }
}) 
res.json(users);

} catch (error){

    console.log(error);
    res.status(500).json(error);

}finally{
    if(conn) {conn.end();}
 }
}




const listUserByID = async (req = request, res = response) => {
    const {id} = req.params;
let conn;

if (isNaN(id)){
    res.status(400).json({msg:`The ID ${id} is invalid`});
    return;
}



try{
    conn = await pool.getConnection();

const [user] = await conn.query(usersModel.getByID,[id],(err)=> {
    if (err){   

       throw err;
    
    }
}) 


if (!user){
res.status(404).json({msg:`user with ID ${id}not found`});
 return;

}

res.json(user);

} catch (error){

    console.log(error);
    res.status(500).json(error);

}finally{
    if(conn) {conn.end();}
 }
}

const addUser = async (req = request, res = response)=>{
    let conn;

    try{
        conn = await pool.getConnection();


        //nuevo endpoint//

        const userAdded = await conn.query(usersModel.addRow,[user],(err)=>{
            if (err) throw err;
    
        })
    

        console.log(userAdded);
        res.json(userAdded);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally {
        if (conn) conn.end();
    }
}

module.exports = {listUsers, listUserByID, addUser}


//routes   -   controllers    - models(DB)