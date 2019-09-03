const express = require("express");
const postModel = require("./posts.model");
const userModel = require('../users/users.model');
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
      
    } = req.body;
    const post = {
      content: req.body.content,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      materials: req.body.materials,
      level: req.body.level,
      timetodone: req.body.timetodone,
      author: req.session.currentUser._id,
      materialSlug: req.body.materialSlug,
      categorySlug: req.body.categorySlug,
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
    .sort({createdAt:-1})
    .populate('author','avatarUrl fullName')
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

postRouter.get(`/mypost/:userId`, (req, res) => {
  postModel
    .find({author:`${req.params.userId}`})
    .populate('author',"avatarUrl")
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

postRouter.get('/get-post-by-id/:postId', (req, res) => {
  postModel.findById(req.params.postId, (err, data) => {
    if(err) {
      res.status(500).json({
          success: false,
          message: err.message,
      })
    } else {
      // console.log(data);
      //get author name
      userModel.findById(data.author, (error, user) => {
        if(error){
          res.status(500).json({
            success: false,
            message: data.message,
          })
        } else {
          //return
          res.status(200).json({
            success: true,
            data: {
              ...data._doc,
              id: data._id,
              authorName: user.fullName,
              avatarUrl: user.avatarUrl,  
            },
          })
        }
      })
    }
  })
});

postRouter.post('/update-vote', (req, res) => {
    const postId = req.body.id;
    postModel.updateOne({ _id: postId }, { $inc: { upvote: 1 } }, (error, data) => {
      if(error){
        res.status(400).json({
          success: false,
          message: error.message,
        })
      } else{
        postModel.findById(postId, (err, post) => {
          if(err) {
            res.status(500).json({
                success: false,
                message: err.message,
            })
          } else {
            res.status(201).json({
              success: true,
              upvote: post.upvote,
            })
          }
        })
      }
  });
})
module.exports = postRouter;
