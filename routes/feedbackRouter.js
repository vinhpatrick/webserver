const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const feedbackController = require('../controllers/feedbackController')

const Feedbacks = require('../models/favorites');
const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, feedbackController.getFeedbacks)
    .post(cors.corsWithOptions, feedbackController.addFeedback)
module.exports = feedbackRouter;