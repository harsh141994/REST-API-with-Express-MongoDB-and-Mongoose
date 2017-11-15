const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');	//we will connect mongoose to mongodb driver so that
//now we will use the function of the mongoose

const Promotions = require('../models/promotions');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());


promotionRouter.route('/')

//because of the next(), program will execute this also
.get((req,res,next) => {
	Promotions.find({})
	.then((promotions)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(promotions);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post((req, res, next) => {	//req.body has parsed the json data
	//already parsed into json by body parser
	Promotions.create(req.body)
	.then((promotion)=>{
		console.log('Promotions created', promotion);
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(promotion);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.put((req, res, next) => {	
	res.statusCode = 403;	
	res.end('Put operation is not supported on /promotions');
})

.delete((req,res,next) => {
	Promotions.remove({})
	.then((resp)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(resp);
	}, (err)=> next(err))
	.catch((err) => next(err));
});


promotionRouter.route('/:promoId')

.get((req,res,next) => {
	Promotions.findById(req.params.promoId)
	.then((promotion)=>{
		res.statusCode = 200;
		res.setHeader ('Content-Type', 'application/json');
		res.json(promotion);
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post( (req, res, next) => {	//req.body has parsed the json data
	res.statusCode = 403;	
	res.end('Post operation is not supported on /promotions/'+ req.params.promoId);})

.put( (req, res, next) => {	
	Promotions.findByIdAndUpdate(req.params.promoId , {
		$set: req.body
    }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})


.delete( (req,res,next) => {
	Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promotionRouter;









