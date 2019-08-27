const express = require('express');
const postModel = require('./posts.model');
const postRouter = express.Router();

postRouter.post(`/create`,(req,res)=>{
    const {content,title,imageUrl,category,materials,level,timetodone} = req.body;
    if(title.length >30 || content.length >1000){
        res.status(400).json({
            success: false,
            message: 'Invalid email address',
        });
    }
    else{
        postModel.find({title:title},(error,data)=>{
            if (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                })
            }
            else if(data){
                res.status(400).json({
                    success: false,
                    message: 'Food has been created',
                })
            }
            else{
                postModel.create(...req.body,(error2,data2)=>{
                    if (error1) {
                        res.status(500).json({
                            success: false,
                            message: error2.message,
                        })
                    }
                    else {
                        res.status(201).json({
                            success: true,
                            data: data2
                        });
                    }
                })
            }
        })
    }
})

module.exports = postRouter;