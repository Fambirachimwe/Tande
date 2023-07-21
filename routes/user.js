import 'dotenv/config'
import User from '../models/user.js';
import express, { json } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();


// signup / register
router.post('/signup', (req, res, next) => {
    const { name, email, phone, password, role } = req.body;

    bcrypt.hash(password, 13, (err, hash) => {
        // Store hash in your password DB.
        if (err) {
            return res.status(400).json({
                message: "failed to create account"
            })
        }
        new User({
            name: name,
            email: email,
            password: hash,
            phone: phone,
            role: role
        }).save().then(data => {
            res.status(200).json({
                message: "new user created",
                user: data
            })
        }).catch(err => {
            // console.log(err)
            res.sendStatus(500)
        })
    });



})

// signin / Login

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    // check the email and validate the password
    User.findOne({ email: email }).then(data => {
        if (data) {
            bcrypt.compare(password, data.password, (err, result) => {
                // result == true
                if (err) return res.sendStatus(401);
                if (result) {
                    // make access token and refreshToken to the client
                    const accessToken = jwt.sign(
                        {
                            username: data.username,
                            id: data._id, email:
                                data.email
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "1d"
                        }
                    );

                    // const refreshToken = jwt.sign(
                    //     {
                    //         username: data.username,
                    //         id: data._id, email:
                    //             data.email
                    //     },
                    //     process.env.REFRESH_TOKEN_SECRET,
                    //     {
                    //         expiresIn: "2d"
                    //     }
                    // );

                    res.status(200).json({
                        accessToken,
                        userId: data._id,
                        username: data.username,
                        email: data.email,
                        role: data.role
                    })
                } else {
                    res.sendStatus(401);
                }
            });
        } else {
            res.status(401).send("no user")
        }
    })
})


export default router;




// checkAuth
// logout

// refresh
