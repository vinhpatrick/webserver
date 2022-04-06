const express = require('express')
const bodyParser = require('body-parser')

const authenticate = require('../authenticate')
const cors = require('./cors')
const commentController = require('../controllers/commentController')

commentRouter = express.Router()
commentRouter.use(bodyParser.json())

commentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, commentController.getAllComments)
    .post(cors.corsWithOptions, authenticate.verifyUser, commentController.addComment)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, commentController.deleteAllComment)
commentRouter.route('/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, commentController.deleteCommentById)
module.exports = commentRouter;