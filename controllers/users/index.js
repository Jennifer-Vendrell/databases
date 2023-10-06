const{request,response} = require(`express`);

const listUsers = (req = request, res = reponse) => {
    res.json({msg: 'Users'})
}

module.exports = listUsers