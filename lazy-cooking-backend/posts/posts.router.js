const express = require("express");
const postModel = require("./posts.model");
const postRouter = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest: "public/exampleImage"
});

postRouter.post(`/create`, (req, res) => {
  if (req.session.currentUser && req.session.currentUser._id) {
    const {
      content,
      title,
      imageUrl,
      category,
      materials,
      level,
      timetodone
    } = req.body;
    const post = {
      content: req.body.content,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      materials: req.body.materials,
      level: req.body.level,
<<<<<<< HEAD
      timetodone: req.body.timetodone,
      author: req.session.currentUser._id
=======
      timetodone: req.body.timetodone
>>>>>>> 18fca50f78d0ddeefc41491635ac08631ff02b66
    };
    if (title.length > 50 || content.length > 1000) {
      res.status(400).json({
        success: false,
        message: "Title and content too long"
      });
    } else {
      postModel.create(post, (error, data) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: error.message
          });
        } else {
          res.status(201).json({
            success: true,
            data: data
          });
        }
      });
    }
  }else {
    res.status(403).json({
      success: false,
      message: 'Unauthenticated',
    });
  }
});

postRouter.get(`/getpost`, (req, res) => {
  //sorBy:price
  //sortOrder:a-z
  const pageNumber = Number(req.query.pageNumber);
  const pageSize = 10;
  if (isNaN(pageNumber)) {
    res.status(500).json({
      success: false,
      message: "pageNumber are invalid"
    });
  } else if (pageNumber < 1 || pageSize < 1 || pageSize > 20) {
    res.status(500).json({
      success: false,
      message: "pageNumber and pageSize are invalid"
    });
  } else {
    postModel
      .find({})
      .sort({ createAt: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .exec((error, data) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: error.message
          });
        } else {
          postModel
            .find({})
            .countDocuments()
            .exec((error, total) => {
              if (error) {
                res.status(500).json({
                  success: false,
                  message: error.message
                });
              } else {
                res.status(200).json({
                  success: true,
                  data: data,
                  total: total
                });
              }
            });
        }
      });
  }
});

postRouter.post("/image", upload.single("image"), (req, res) => {
  fs.rename(
    `public/exampleImage/${req.file.filename}`,
    `public/exampleImage/${req.file.originalname}`,
    err => {
      if (err) {
        res.status(500).json({
          success: false,
          message: err.message
        });
      } else {
        res.status(201).json({
          success: true,
          data: {
            imageUrl: `http://localhost:3001/exampleImage/${req.file.originalname}`
          }
        });
      }
    }
  );
});
module.exports = postRouter;
