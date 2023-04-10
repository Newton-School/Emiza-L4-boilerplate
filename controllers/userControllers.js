const users   = require("../models/user.js");
const tasks   = require("../models/task.js");
const bcrypt  = require('bcrypt');
const { valid } = require("joi");

const loginUser =async (req, res) => {

    const email  = req.body.email;
    const password = req.body.password;

    const val = await users.find({ 'email':email });

    if(val.length){

        if(bcrypt.compareSync(password , val[0].password)){
            res.status(200).json({
                "status": 'success',
                "data": val[0]
            });
        }else{
            // console.log('Invalid Password');
            res.status(403).json({
                "message": 'Invalid Password, try again !!',
                "status": 'fail'
            });
        }
    }else{
        // console.log('User doesnot exist');
        res.status(404).json({
            "message": 'User with this E-mail does not exist !!',
            "status": 'fail'
        });
    }

}

const signupUser = async (req, res) => {

    var name = req.body.name;
    var email  = req.body.email;
    var password = req.body.password;
    var role = req.body.role;


    // Generate a salt to be used for hashing
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    var newuser = {
        "name":name,
        "email":email,
        "password": hashedPassword,
        "role": role
    };

    users.create(newuser).then((user) => {
        res.status(200).json({
            "message": 'User SignedUp successfully',
            "status": 'success'
        });
    })
    .catch((error) => {
        // console.log(error.message);
        res.status(404).json({
            "status": 'fail',
            "message": error.message
        });
    });

}

module.exports = { loginUser , signupUser };