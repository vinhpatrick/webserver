const express = require('express')
const bodyParser = require('body-parser')

const authenticate = require('../authenticate')
const cors = require('./cors')
const commentController = require('../controllers/commentController')

commentRouter = express.Router()
commentRouter.use(bodyParser.json())

commentRouter.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, commentController.getAllComments)
    .post(cors.cors, authenticate.verifyUser, commentController.addComment)
    .delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, commentController.deleteAllComment)
commentRouter.route('/:commentId')
    .options(cors.cors, (req, res) => { res.sendStatus(200); })
    .delete(cors.cors, authenticate.verifyUser, commentController.deleteCommentById)

module.exports = commentRouter;