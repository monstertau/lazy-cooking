const express = require('express');
const UserModel = require('./users.model');
const bcryptjs = require('bcryptjs');
const userRouter = express.Router();
const multer = require('multer');
const fs = require('fs');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /(09|01[2|6|8|9])+([0-9]{8})\b/g;
const avatarUrlRegex = /\.(jpg|jpeg|png|gif)$/;
const upload = multer({
    dest: 'public/avatar',
});

userRouter.post('/register', (req, res) => {
    //get email + password + fullname + phone from req.body
    const { email, password, fullName, phone } = req.body;

    //validate
    if (!email || !emailRegex.test(email)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email address',
        });
    } else if (!password || password.length < 6) {
        res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters',
        });
    } else if (!fullName || fullName.trim().length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please input full name',
        });
    } else if (!phone) {
        res.status(400).json({
            success: false,
            message: 'Phone number must be contain 10 digits!',
        });
    } else {
        // check email exist
        UserModel.findOne({ email: email }, (error, data) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            } else if (data) {
                res.status(400).json({
                    success: false,
                    message: 'Email has been used!'
                })
            } else {
                // encrypt password
                const hashPassword = bcryptjs.hashSync(password, 10);

                //save tp db
                UserModel.create({
                    ...req.body,
                    password: hashPassword,
                }, (error, newUser) => {
                    if (error) {
                        res.status(500).json({
                            success: false,
                            message: error.message,
                        });
                    } else {
                        res.status(201).json({
                            success: true,
                            data: {
                                ...newUser._doc,
                                password: '',
                            },
                        });
                    }
                });
            }
        })
    }
})


userRouter.post('/login', (req, res) => {
    //get email + password from req.body
    const { email, password } = req.body;

    //validate 
    if (!email || !emailRegex.test(email)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email address!',
        });
    } else if (password.trim().length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please input password!',
        });
    } else {
        // check email exist
        UserModel.findOne({ email: email }, (err, user) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err.message,
                });
            } else if (!user) {
                res.status(500).json({
                    success: false,
                    message: 'Email does not exist!',
                });
            } else if (!bcryptjs.compareSync(password, user.password)) { // compare password
                res.status(400).json({
                    success: false,
                    message: "Wrong password!",
                });
            } else {
                //save current user info to session storage
                req.session.currentUser = {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    avatarUrl: user.avatarUrl,
                }
                // response to client
                res.status(201).json({
                    success: true,
                    data: {
                        email: user.email,
                        fullName: user.fullName,
                        avatarUrl: user.avatarUrl,
                        id: user._id
                    }
                });
            }
        });
    }
});

userRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Logout success!',
            });
        }
    });
});

userRouter.get('/test', (req, res) => {
    res.status(201).json({
        success: true,
        data: req.session.currentUser,
    });
});

userRouter.get('/profile/:id', (req, res) => {
    //check login
    if (!req.params.id) {
        res.status(400).json({
            success: false,
            message: 'Unauthenticated!',
        });
    } else {
        UserModel.findOne({ _id: req.params.id }, (err, data) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: err.message,
                });
            } else if (!data) {
                res.status(500).json({
                    success: false,
                    message: 'deo co data',
                });
            } else {
                res.status(201).json({
                    success: true,
                    data: {
                        ...data._doc,
                        password: '',
                    }
                })
            }
        });
    }
});


userRouter.post('/avatar', upload.single('avatar'), (req, res) => {
    // rename file
    const fileName = req.file.originalname.split(".");
    const fileType = fileName[fileName.length - 1];
    const newFileName = Date.now() + '.' + fileType;
    //save to public directory
    fs.rename(`public/avatar/${req.file.filename}`, `public/avatar/${req.file.originalname}`, (err) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(201).json({
                success: true,
                data: {
                    imageUrl: `http://localhost:3001/avatar/${req.file.originalname}`
                }
            })
        }
    })
})

userRouter.post('/update', (req, res) => {
    // check login
    if (!req.body.id) {
        res.status(400).json({
            success: false,
            message: 'Unauthenticate!'
        })
    } else {
        // get data from req.body
        const { email, fullName, phone, avatarUrl, id, pass } = req.body;

        //validate
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Invalid is not correct',
            });
        } else if (!fullName || fullName.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Please input full name',
            });
        } else if (!phone) {
            res.status(400).json({
                success: false,
                message: 'Phone number is invalid!',
            });
        } else if (!avatarUrl || !avatarUrlRegex.test(avatarUrl)) {
            res.status(400).json({
                success: false,
                message: 'Invalid avatar url!',
            })
        } else {
            // check password
            UserModel.findOne({ _id: id }, (error, data) => {
                if (error) {
                    res.status(500).json({
                        success: false,
                        message: error.message,
                    });
                } else if (data) {

                    // update
                    UserModel.updateOne({ _id: id }, { $set: { fullName: fullName, phone: phone, avatarUrl: avatarUrl, email: email } }, (error, data2) => {
                        if (error) {
                            res.status(400).json({
                                success: false,
                                message: error.message,
                            });
                        } else if (!data) {
                            res.status(400).json({
                                success: false,
                                message: 'deo co data',
                            });
                        } else {
                            // response update success
                            res.status(201).json({
                                success: true,
                                data: data2,
                            })
                        }
                    });
                }
            });
        }
    }
});

userRouter.get('/check-session', (req, res) => {
    if (req.session.currentUser) {
        res.status(201).json({
            success: true,
        })
    } else {
        res.status(400).json({
            success: false,
        })
    }
})

userRouter.post('/login-with-google', (req, res) => {
    const { email } = req.body;
    UserModel.findOne({ email: email }, (error, data) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        } else if (!data) {
            res.status(500).json({
                success: true,
                message: 'Account is not register yet!',
                isRegisted: false,
            })
        } else {
            req.session.currentUser = {
                _id: data._id,
                email: data.email,
                fullName: data.fullName,
                avatarUrl: data.avatarUrl,
            }
            // response to client
            res.status(201).json({
                success: true,
                data: {
                    email: data.email,
                    fullName: data.fullName,
                    avatarUrl: data.avatarUrl,
                    id: data._id
                },
                isRegisted: true,
            });
        }
    });
})

module.exports = userRouter;