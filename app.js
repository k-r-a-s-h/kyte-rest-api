const express = require('express');
const logger = require('morgan');

const sequelize = require('./util/database');
const User = require('./models/user');
const Post = require('./models/post');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/post', postRouter);
app.use('/api/user', userRouter);

app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ msg: err.message || 'Error occured' });
});


User.hasMany(Post, {foreignKey: 'p_id', sourceKey: 'id'});

sequelize.sync()
    .then(result => {
        app.listen(process.env.PORT);
        console.log('Server running on localhost:5000');
    })
    .catch(err => {
        console.log(err);
    });