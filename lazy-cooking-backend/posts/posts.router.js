const express = require("express");
const postModel = require("./posts.model");
const userModel = require("../users/users.model");
const postRouter = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest: "public/exampleImage"
});

postRouter.post(`/create`, (req, res) => {
  if (req.session.currentUser && req.session.currentUser._id) {
    const { content, title } = req.body;
    const post = {
      content: req.body.content,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      materials: req.body.materials,
      level: req.body.level,
      timetodone: req.body.timetodone,
      author: req.session.currentUser._id,
      slug: req.body.slug
    };
    // if (title.length > 50 || content.length > 1000) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Title and content too long"
    //   });
    // } else {
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
    }); //asdasda
    // }
  } else {
    res.status(403).json({
      success: false,
      message: "Unauthenticated"
    });
  }
});

postRouter.get(`/getpost`, (req, res) => {
  postModel
    .find({})
    .sort({ createdAt: -1 })
    .populate("author", "avatarUrl fullName")
    .exec((error, data) => {
      if (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(200).json({
          success: true,
          data: data
        });
      }
    });
});

postRouter.get(`/mypost/:userId`, (req, res) => {
  postModel
    .find({ author: `${req.params.userId}` })
    .sort({ createdAt: -1 })
    .populate("author", "avatarUrl")
    .exec((error, data) => {
      if (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(200).json({
          success: true,
          data: data
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

postRouter.get("/get-post-by-id/:postId", (req, res) => {
  var voted = false;
  postModel.findById(req.params.postId, (err, data) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    } else {
      if (req.session.currentUser && req.session.currentUser._id) {
        const find = data._doc.upvote.filter(
          key => key == req.session.currentUser._id
        );
        if (find.length !== 0) {
          voted = true;
        } else {
          voted = false;
        }
      }
      //get author name
      userModel.findById(data.author, (error, user) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: data.message
          });
        } else {
          //return

          res.status(200).json({
            success: true,
            data: {
              ...data._doc,
              id: data._id,
              authorName: user.fullName,
              avatarUrl: user.avatarUrl,
              totalVote: data._doc.upvote.length,
              voted: voted
            }
          });
        }
      });
    }
  });
});

postRouter.post("/update-vote", (req, res) => {
  if (req.session.currentUser && req.session.currentUser._id) {
    const postId = req.body.id;
    const userId = req.session.currentUser._id;
    postModel.findById(postId, (err, post) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: err.message
        });
      } else {
        const find = post.upvote.filter(key => key == userId);
        if (find.length !== 0) {
          //add user id
          postModel.update(
            { _id: postId },
            { $pull: { upvote: userId } },
            (err, data) => {
              if (err) {
                res.status(500).json({
                  success: false,
                  message: err.message
                });
              } else {
                postModel.findById({ _id: postId }, (error, updatedData) => {
                  if (error) {
                    res.status(500).json({
                      success: false,
                      message: updatedData.message
                    });
                  } else {
                    res.status(201).json({
                      success: true,
                      data: {
                        ...updatedData._doc,
                        totalVote: updatedData.upvote.length,
                        voted: false
                      }
                    });
                  }
                });
              }
            }
          );
        } else {
          // remove user id
          postModel.update(
            { _id: postId },
            { $push: { upvote: userId } },
            (err, data) => {
              if (err) {
                res.status(500).json({
                  success: false,
                  message: err.message
                });
              } else {
                postModel.findById({ _id: postId }, (error, updatedData) => {
                  if (error) {
                    res.status(500).json({
                      success: false,
                      message: updatedData.message
                    });
                  } else {
                    res.status(201).json({
                      success: true,
                      data: {
                        ...updatedData._doc,
                        totalVote: updatedData.upvote.length,
                        voted: true
                      }
                    });
                  }
                });
              }
            }
          );
        }
      }
    })
  } else {
    res.status(403).json({
      success: false,
      message: "Unauthenticated"
    });
  }
})

postRouter.post('/comment', (req, res) => {

  if (req.session.currentUser && req.session.currentUser._id) {
    const postId = req.body.postId;
    const content = req.body.content;
    const userId = req.session.currentUser._id;
    if (!content || content.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please input your comment',
      })
    } else {
      const commentId = Date.now();
      //get user Name
      userModel.findById(userId, (error, user) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: data.message,
          })
        } else {
          const userName = user.fullName;
          const avatarUrl = user.avatarUrl;

          //save to database
          postModel.update({ _id: postId }, { $push: { comments: { id: commentId, userId: userId, userName: userName, userAvatarUrl: avatarUrl, content: content } } }, (err, data) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: err.message,
              })
            } else {
              postModel.findById({ _id: postId }, (error, updatedData) => {
                if (error) {
                  res.status(500).json({
                    success: false,
                    message: updatedData.message,
                  })
                } else {
                  res.status(201).json({
                    success: true,
                    data: updatedData.comments,
                  })
                }
              })
            }
          })
        }
      })
    }
  } else {
    res.status(500).json({
      success: false,
      message: 'Unauthenticated',
    })
  }
})


postRouter.get("/get-recipe/:type", (req, res) => {
  console.log(req.params.type);
  if (req.params.type === "all") {
    postModel
    .find({})
    .sort({ createdAt: -1 })
    .populate("author", "avatarUrl fullName")
    .exec((error, data) => {
      if (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(200).json({
          success: true,
          data: data
        });
      }
    });
  } else {
    postModel
      .find({ slug: `${req.params.type}` })
      .sort({ createdAt: -1 })
      .populate("author", "avatarUrl fullName")
      .exec((err, data) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: error.message
          });
        } else {
          res.status(200).json({
            success: true,
            data: data
          });
        }
      });
  }
});
module.exports = postRouter;
