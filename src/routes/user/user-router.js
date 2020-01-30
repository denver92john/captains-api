const express = require('express');
const path = require('path');
const UserService = require('./user-service');

// using thingful-server as reference

const userRouter = express.Router();
const jsonParser = express.json();

userRouter
    .post('/', jsonParser, (req, res, next) => {
        const {username, password, re_password} = req.body;
        //const newUser = {username, password, re_password};

        for (const field of ['username', 'password', 're_password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        if(password !== re_password) {
            return res.status(400).json({
                error: {message: `Passwords don't match`}
            })
        }

        const passwordError = UserService.validatePassword(password);

        if (passwordError) {
            return res.status(400).json({error: passwordError})
        }

        UserService.hasUserWithUserName(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUserName => {
                if(hasUserWithUserName) {
                    return res.status(400).json({
                        error: {message: `Username already taken`}
                    })
                }

                return UserService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            username,
                            password: hashedPassword
                        }
                        return UserService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UserService.serializeUser(user))
                            })
                    })
            })
    })

module.exports = userRouter;