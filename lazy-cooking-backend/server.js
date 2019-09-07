const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const userRouter = require('./users/users.router');
const postRouter = require('./posts/posts.router');
const MongoStore = require('connect-mongo')(session);
const db = mongoose.connection


mongoose.connect('mongodb://localhost:27017/lazy-cooking', { useNewUrlParser: true }, (error) => {
    if(error){
        throw error;
    }else {
        console.log('Connection to MB successfully!');

        const app = express();
        app.use(bodyParser.json());
        app.use(cors({
            origin: "http://localhost:3000",
            credentials:true,
        }));
        app.use(session({
            secret: 'keyboard cat',
            store: new MongoStore({ mongooseConnection: db })
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