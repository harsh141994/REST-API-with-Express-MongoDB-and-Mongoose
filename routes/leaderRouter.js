const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');	//we will connect mongoose to mongodb driver so that
//now we will use the function of the mongoose

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());


leaderRouter.route('/')

//because of the next(), program will execute this also
.get((req,res,next) => {
	Leaders.find({})
	.then((leaders)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(leaders);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post((req, res, next) => {	//req.body has parsed the json data
	//already parsed into json by body parser
	Leaders.create(req.body)
	.then((leader)=>{
		console.log('Leaders created', leader);
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(leader);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.put((req, res, next) => {	
	res.statusCode = 403;	
	res.end('Put operation is not supported on /leaders');
})

.delete((req,res,next) => {
	Leaders.remove({})
	.then((resp)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(resp);
	}, (err)=> next(err))
	.catch((err) => next(err));
});


leaderRouter.route('/:leaderId')

.get((req,res,next) => {
	Leaders.findById(req.params.leaderId)
	.then((leader)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(leader);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post( (req, res, next) => {	//req.body has parsed the json data
	res.statusCode = 403;	
	res.end('Post operation is not supported on /leaders/'+ req.params.leaderId);})

.put( (req, res, next) => {	
	Leaders.findByIdAndUpdate(req.params.leaderId , {
		$set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})


.delete( (req,res,next) => {
	Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = leaderRouter;







