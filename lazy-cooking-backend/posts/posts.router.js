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
      timetodone: req.body.timetodone,
      author: req.session.currentUser._id
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
      });//asdasda
    }
  } else {
    res.status(403).json({
      success: false,
      message: 'Unauthenticated',
    });
  }
});

postRouter.get(`/getpost`, (req, res) => {
  postModel
    .find({})
    .exec((error, data) => {
      if (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(200).json({
          success: true,
          data: data,
        });
      }
    });

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
