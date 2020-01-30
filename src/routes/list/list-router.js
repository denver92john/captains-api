const path = require('path');
const express = require('express');
const ListService = require('./list-service');

const listRouter = express.Router();
const jsonParser = express.json();

listRouter
    .route('/')
    .get((req, res, next) => {
        ListService.getAllLists(req.app.get('db'))
            .then(lists => {
                res.json(lists.map(ListService.serializeList))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        // will remove user_id from request body in future
        const {list_name, user_id} = req.body;
        const newList = {list_name};

        for (const [key, value] of Object.entries(newList)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }

        //cuz attaching user.id to req obj in auth
        //newList.user_id = req.user.id
        newList.user_id = user_id

        ListService.insertList(
            req.app.get('db'),
            newList
        )
            .then(list => {
                res
                    .status(201)
                    //.location(`/list/${list.id}`)
                    .location(path.posix.join(req.originalUrl, `/${list.id}`))
                    .json(list)
            })
            .catch(next)
    })

listRouter
    .route('/:list_id')
    .all((req, res, next) => {
        ListService.getById(
            req.app.get('db'),
            req.params.list_id
        )
            .then(list => {
                if (!list) {
                    return res.status(404).json({
                        error: {message: `List doesn't exist`}
                    })
                }
                res.list = list
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(ListService.serializeList(res.list))
    })
    .delete((req, res, next) => {
        ListService.deleteListById(
            req.app.get('db'),
            req.params.list_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {list_name} = req.body;
        const listToUpdate = {list_name};

        const numberOfValues = Object.values(listToUpdate).filter(Boolean).length;
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {message: `Request body must contain 'list_name'`}
            })
        }

        //res.status(204).end()
        ListService.updateListById(
            req.app.get('db'),
            req.params.list_id,
            listToUpdate
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = listRouter;