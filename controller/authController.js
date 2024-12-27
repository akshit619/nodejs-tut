const User = require('../model/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const handleLogin = async (req,res) => {
    // console.log(process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({'message': 'username and password are required.'});


    const foundUser = await User.findOne({username: user}).exec();


    if(!foundUser){
        return res.sendStatus(401) // unauthorised
    }
    //evaluate password
    const match = await bcrypt.compare(pwd,foundUser.password);

    if(match){
        //create JWTs
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s'}
        );

        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        return res.json({accessToken});

    }else{
        return res.sendStatus(401);
    }
}

module.exports = { handleLogin };

//Aa$12345