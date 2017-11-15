const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');	//we will connect mongoose to mongodb driver so that
//now we will use the function of the mongoose

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//all the following is just the one group, just to avoid any mismatch (/dishes or /dish)
//further we need to mount this router in the index.js
dishRouter.route('/')

//because of the next(), program will execute this also
.get((req,res,next) => {
	//find operation on the Dishes
	Dishes.find({})
	.then((dishes)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(dishes);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post((req, res, next) => {	//req.body has parsed the json data
	//already parsed into json by body parser
	Dishes.create(req.body)
	.then((dish)=>{
		console.log('Dish created', dish);
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(dish);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.put((req, res, next) => {	
	res.statusCode = 403;	
	res.end('Put operation is not supported on /dishes');
})

.delete((req,res,next) => {
	Dishes.remove({})
	.then((resp)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(resp);
	}, (err)=> next(err))
	.catch((err) => next(err));
});

//for dishIDs

dishRouter.route('/:dishId')

.get((req,res,next) => {
	//id is present in req.params.dishId
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(dish);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post( (req, res, next) => {	//req.body has parsed the json data
	res.statusCode = 403;	
	res.end('Post operation is not supported on /dishes/'+ req.params.dishId);})

.put( (req, res, next) => {	
	Dishes.findByIdAndUpdate(req.params.dishId , {
		$set: req.body
    }, { new: true })
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})


.delete( (req,res,next) => {
	Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = dishRouter;
