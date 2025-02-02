const User = require('../model/User.js');
const bcrypt = require('bcrypt');

const handleNewUser = async (req,res) => {
    const {user, pwd} = req.body;

    if(!user || !pwd)  return res.status(409).json({'Message': 'username and password are required.'});

    //check for duplicate in the User collection
    const duplicate = await User.findOne({username: user}).exec();
    if(duplicate) return res.sendStatus(409); //conflict

    try{
        //encrypt the pass, add salt = 10(or anything, just check industry standards)
        const hashedPwd = await bcrypt.hash(pwd,10);

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(result);
        return res.status(201).json({'Success':`New user ${user} created.`})
    } catch (err){
        return res.status(500).json({'Message': err.message});
    }
};

module.exports = {handleNewUser};