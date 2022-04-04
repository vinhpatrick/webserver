const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');

const Carts = require('../models/cart');
const cartRouter = express.Router();
productRouter.use(bodyParser.json());

cartRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, (req, res, next) => {
        
    })