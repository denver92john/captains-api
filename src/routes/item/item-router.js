const path = require('path');
const express = require('express');
const ItemService = require('./item-service');
const {requireAuth} = require('../../middleware/jwt-auth');

const itemRouter = express.Router();
const jsonParser = express.json();

itemRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        ItemService.getAllItems(req.app.get('db'))
            .then(items => {
                res.json(items.map(ItemService.serializeItem))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {item_name, list_id} = req.body;
        const newItem = {item_name, list_id}

        for (const [key, value] of Object.entries(newItem)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }

        ItemService.insertItem(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${item.id}`))
                    .json(ItemService.serializeItem(item))
            })
            .catch(next)
    })

itemRouter
    .route('/:item_id')
    .all(requireAuth, (req, res, next) => {
        ItemService.getByItemId(
            req.app.get('db'),
            req.params.item_id
        )
            .then(item => {
                if (!item) {
                    return res.status(404).json({
                        error: {message: `Item doesn't exist`}
                    })
                }
                res.item = item
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        ItemService.deleteItemById(
            req.app.get('db'),
            req.params.item_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {item_name} = req.body;
        const itemToUpdate = {item_name};

        const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {message: `Request body must contain 'item_name'`}
            })
        }

        ItemService.updateItemById(
            req.app.get('db'),
            req.params.item_id,
            itemToUpdate
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

itemRouter
    .get('/list/:list_id', (req, res, next) => {
        ItemService.getItemsByListId(
            req.app.get('db'),
            req.params.list_id
        )
            .then(items => {
                res.json(items.map(ItemService.serializeItem))
            })
            .catch(next)
    })

module.exports = itemRouter;