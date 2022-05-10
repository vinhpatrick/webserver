const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const feedbackController = require('../controllers/feedbackController')

const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, feedbackController.getFeedbacks)
    .post(cors.cors, feedbackController.addFeedback)
module.exports = feedbackRouter;