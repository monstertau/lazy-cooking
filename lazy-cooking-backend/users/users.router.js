const express = require('express');
const UserModel = require('./users.model');
const bcryptjs = require('bcryptjs');
const userRouter = express.Router();
const multer = require('multer');
const fs = require('fs');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^\d{10}$/;
const avatarUrlRegex = /\.(jpg|jpeg|png|gif)$/;
const upload = multer({
<<<<<<< HEAD
    dest: 'public/avatar',
=======
    dest: 'public/',
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
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
    } else if (!phone || !phoneRegex.test(phone)) {
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
<<<<<<< HEAD
                        id: user._id
=======
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
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

userRouter.get('/profile', (req, res) => {
    //check login
    if (!req.session.currentUser || !req.session.currentUser._id) {
        res.status(400).json({
            success: false,
            message: 'Unauthenticated!',
        });
    } else {
        UserModel.findOne({ email: req.session.currentUser.email }, (err, data) => {
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
<<<<<<< HEAD
    console.log(req);
=======
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
    const fileName = req.file.originalname.split(".");
    const fileType = fileName[fileName.length - 1];
    const newFileName = Date.now() + '.' + fileType;

    //save to public directory
<<<<<<< HEAD
    fs.rename(`public/avatar/${req.file.filename}`, `public/avatar/${req.file.originalname}`, (err) => {
=======
    fs.rename(`public/${req.file.filename}`, `public/${newFileName}`, (err) => {
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
        if (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(201).json({
                success: true,
                data: {
                    imageUrl: `http://localhost:3001/${newFileName}`
                }
            })
        }
    })
})

userRouter.post('/update', (req, res) => {
    // check login
    if (!req.session.currentUser || !req.session.currentUser._id) {
        res.status(400).json({
            success: false,
            message: 'Unauthenticate!'
        })
    } else {
        // get data from req.body
<<<<<<< HEAD
        const { email, fullName, phone, avatarUrl, emailOld } = req.body;

        //validate
        if (!email || !emailOld) {
=======
        const { email, fullName, phone, avatarUrl, password } = req.body;

        //validate
        if (email !== req.session.currentUser.email) {
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
            res.status(400).json({
                success: false,
                message: 'Invalid is not correct',
            });
<<<<<<< HEAD
=======
        } else if (!password) {
            res.status(400).json({
                success: false,
                message: 'Please input password',
            });
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
        } else if (!fullName || fullName.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Please input full name',
            });
        } else if (!phone || !phoneRegex.test(phone)) {
            res.status(400).json({
                success: false,
                message: 'Phone number must be contain 10 digits!',
            });
        } else if (!avatarUrl || !avatarUrlRegex.test(avatarUrl)) {
            res.status(400).json({
<<<<<<< HEAD
                success: false,
=======
                success: false, 
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
                message: 'Invalid avatar url!',
            })
        } else {
            // check password
<<<<<<< HEAD
            UserModel.findOne({ email: emailOld }, (error, data) => {
=======
            UserModel.findOne({ email: email }, (error, data) => {
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
                if (error) {
                    res.status(500).json({
                        success: false,
                        message: error.message,
                    });
                } else if (data) {
<<<<<<< HEAD

                    // update
                    UserModel.updateOne({ email: emailOld }, { $set: { fullName: fullName, phone: phone, avatarUrl: avatarUrl, email: email } }, (error, data) => {
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
                                data: data,
                            })
                        }
                    });

                    //update session
                    // UserModel.findOne({ email: email }, (err, user) => {
                    //     if (err) {
                    //         res.status(500).json({
                    //             success: false,
                    //             message: err.message,
                    //         });
                    //     } else if (!user) {
                    //         res.status(500).json({
                    //             success: false,
                    //             message: 'Email does not exist!',
                    //         });
                    //     } else {
                    //         //save current user info to session storage
                    //         req.session.reload((err) => {
                    //             if(err){
                    //                 res.status(400).json({
                    //                     success: false,
                    //                     message: err.message,
                    //                 })
                    //             } else{
                    //                 res.render('index', {
                    //                     _id: user._id,
                    //                     email: user.email,
                    //                     fullName: user.fullName,
                    //                     avatarUrl: user.avatarUrl,
                    //                 })
                    //             }
                    //         })
                    //     }
                    // });

=======
                    if (!bcryptjs.compareSync(password, data.password)) {
                        res.status(500).json({
                            success: false,
                            message: 'Password is not correct!',
                        });
                    } else {
                        // update
                        UserModel.updateOne({ email: email }, { $set: {fullName: fullName, phone: phone, avatarUrl: avatarUrl}}, (error, data) => {
                            if(error){
                                res.status(400).json({
                                    success: false,
                                    message: error.message,
                                });
                            } else if(!data){
                                res.status(400).json({
                                    success: false,
                                    message: 'deo co data',
                                });
                            } else {
                                // response update success
                                res.status(201).json({
                                    success: true,
                                })
                            }
                        });

                        //update session
                        // UserModel.findOne({ email: email }, (err, user) => {
                        //     if (err) {
                        //         res.status(500).json({
                        //             success: false,
                        //             message: err.message,
                        //         });
                        //     } else if (!user) {
                        //         res.status(500).json({
                        //             success: false,
                        //             message: 'Email does not exist!',
                        //         });
                        //     } else {
                        //         //save current user info to session storage
                        //         req.session.reload((err) => {
                        //             if(err){
                        //                 res.status(400).json({
                        //                     success: false,
                        //                     message: err.message,
                        //                 })
                        //             } else{
                        //                 res.render('index', {
                        //                     _id: user._id,
                        //                     email: user.email,
                        //                     fullName: user.fullName,
                        //                     avatarUrl: user.avatarUrl,
                        //                 })
                        //             }
                        //         })
                        //     }
                        // });
                    }
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
                }
            });
        }
    }
});

module.exports = userRouter;