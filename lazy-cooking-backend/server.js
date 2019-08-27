const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const userRouter = require('./users/users.router');
const postRouter = require('./posts/posts.router');

mongoose.connect('mongodb://localhost:27017/lazy-cooking', { useNewUrlParser: true }, (error) => {
    if(error){
        throw error;
    }else {
        console.log('Connection to MB successfully!');

        const app = express();
        app.use(bodyParser.json());
        app.use(cors({
            origin: "http://localhost:3000/"
        }));
        app.use(session({
            secret: 'keyboard cat',
        }));
        app.use(express.static('public'));

        app.use('/users', userRouter);
        app.use('/posts',postRouter);
        app.listen(3001, (err) => {
            if(err){
                throw err;
            }
            console.log('Server listen on port 3001 ...');
        });
    }
});