const express = require('express');
const postModel = require('./posts.model');
const postRouter = express.Router();

postRouter.post(`/create`,(req,res)=>{
    const {content,title,imageUrl,category,materials,level,timetodone} = req.body;
    const post ={
        content: req.body.content,
        title: req.body.title,
        imageUrl:req.body.imageUrl,
        category: req.body.category,
        materials: req.body.materials,
        level: req.body.level,
        timetodone: req.body.timetodone
    }
    if(title.length >30 || content.length >1000){
        res.status(400).json({
            success: false,
            message: 'Invalid email address',
        });
    }
    else{
        postModel.findOne({title:title},(error,data)=>{
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
                postModel.create(post,(error1,data1)=>{
                    if (error1) {
                        res.status(500).json({
                            success: false,
                            message: error.message,
                        })
                    }
                    else {
                        res.status(201).json({
                            success: true,
                            data: data1
                        });
                    }
                })
            }
        })
    }
})

postRouter.get(`/getpost`, (req, res) => {
    //sorBy:price
    //sortOrder:a-z
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = 10;
    if (isNaN(pageNumber) ) {
        res.status(500).json({
            success: false,
            message: 'pageNumber are invalid'
        })
    }
    else if (pageNumber < 1 || pageSize < 1 || pageSize > 20) {
        res.status(500).json({
            success: false,
            message: 'pageNumber and pageSize are invalid'
        })
    }
    else {
        postModel.find({})
            .sort({ createAt: -1 })
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .exec((error, data) => {
                if(error){
                    res.status(500).json({
                        success: false,
                        message: error.message
                    })
                }
                else{
                    postModel.find({}).countDocuments().exec((error,total)=>{
                        if(error){
                            res.status(500).json({
                                success: false,
                                message: error.message
                            })
                        }
                        else{
                            res.status(200).json({
                                success:true,
                                data:data,
                                total:total
                            })
                        }
                    })
                }
            })
    }
})

module.exports = postRouter;