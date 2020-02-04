const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const {username, password} = req.body;
        const loginUser = {username, password};

        for (const [key, value] of Object.entries(loginUser)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }

        AuthService.getUserWithUserName(
            req.app.get('db'),
            username
        )
            .then(dbUser => {
                if(!dbUser) {
                    return res.status(400).json({
                        error: {message: `Incorrect username or password`}
                    })
                }

                return AuthService.comparePasswords(
                    password,
                    dbUser.password
                )
                    .then(compareMatch => {
                        if (!compareMatch) {
                            return res.status(400).json({
                                error: {message: `Incorrect username or password`}
                            })
                        }

                        const sub = dbUser.username;
                        const payload = {user_id: dbUser.id}
                        res.send({
                            authToken: AuthService.createJwt(sub, payload),
                            user: {
                                id: dbUser.id,
                                username: dbUser.username
                            }
                        })
                    })
            })
            .catch(next)
    })

module.exports = authRouter;