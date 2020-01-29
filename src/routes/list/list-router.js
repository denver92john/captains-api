const express = require('express');
const ListService = require('./list-service');

const listRouter = express.Router();

listRouter
    .route('/')
    .get((req, res, next) => {
        ListService.getAllLists(req.app.get('db'))
            .then(lists => {
                res.json(lists)
            })
            .catch(next)
    })

module.exports = listRouter;