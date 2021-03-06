require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const listRouter = require('./routes/list/list-router');
const itemRouter = require('./routes/item/item-router');
const userRouter = require('./routes/user/user-router');
const authRouter = require('./routes/auth/auth-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'dev', {
    skip: () => NODE_ENV === 'test'
}))
app.use(helmet());
app.use(cors());

app.use('/api/list', listRouter);
app.use('/api/item', itemRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!')
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        console.error(error);
        response = {message: error.message, error}
    }
    res.status(500).json(response);
});

module.exports = app;