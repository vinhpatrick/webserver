const express = require('express')
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

var strorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('you can upload only image file !'), false);
    } else {
        cb(null, true);
    }
}
const upload = multer({
    storage: strorage, fileFilter: imageFileFilter,
});

const uploadRouter = express.Router();


uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus(200); })

    .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, upload.array('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    })


module.exports = uploadRouter;