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













//all the following is just the one group, just to avoid any mismatch (/dishes or /dish)
//further we need to mount this router in the index.js
dishRouter.route('/:dishId/comments')

//because of the next(), program will execute this also
.get((req,res,next) => {
	//find operation on the Dishes
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null){
			res.statusCode = 200;
			res.setHeader ('Content-Type', 'application/json');
			res.json(dish.comments);	//returning only comments
		}
		else{
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);	//this will go to app.js and will be handled by the error handler
		}
		
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post((req, res, next) => {	
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null){
			dish.comments.push(req.body);
			dish.save()
			.then((dish)=>{
				res.statusCode = 200;
				res.setHeader ('Content-Type', 'application/json');
				res.json(dish);	

			}, (err)=> next(err));
		}
		else{
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);	//this will go to app.js and will be handled by the error handler
		}
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.put((req, res, next) => {	
	res.statusCode = 403;	
	res.end('Put operation is not supported on /dishes/'+ req.params.dishId + '/comments' );
})

.delete((req,res,next) => {
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null){
			for(var i = (dish.comments.length -1) ; i>=0; i--){//deleting each comment one by one
				dish.comments.id(dish.comments[i]._id). remove();
			}	
			dish.save()
			.then((dish)=>{
				res.statusCode = 200;
				res.setHeader ('Content-Type', 'application/json');
				res.json(dish);	

			}, (err)=> next(err));

			
		}
		else{
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);	//this will go to app.js and will be handled by the error handler
		}
	}, (err)=> next(err))
	.catch((err) => next(err));
});














dishRouter.route('/:dishId/comments/:commentId')

.get((req,res,next) => {
	//id is present in req.params.dishId
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null && dish.comments.id(req.params.commentId)!=null ){	//dish, comment, comment with that id exits
			res.statusCode = 200;
			res.setHeader ('Content-Type', 'application/json');
			res.json(dish.comments.id(req.params.commentId));	//specific comment
		}
		else if (dish == null) {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);	//this will go to app.js and will be handled by the error handler
		}
		else{//comment does not exist
			err = new Error('Comment' + req.params.commentId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, (err)=> next(err))
	.catch((err) => next(err));
})

.post( (req, res, next) => {	//req.body has parsed the json data
	res.statusCode = 403;	
	res.end('Post operation is not supported on /dishes/'+ req.params.dishId + '/comments/' + req.params.commentId);})

.put( (req, res, next) => {	
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null && dish.comments.id(req.params.commentId)!=null ){	//dish, comment, comment with that id exits
			//we dont want to change the author in the comments
			if(req.body.rating){
				dish.comments.id(req.params.commentId).rating = req.body.rating;
			}
			if(req.body.comment){
				dish.comments.id(req.params.commentId).comment = req.body.comment;
			}
			dish.save()
			.then((dish)=>{
				res.statusCode = 200;
				res.setHeader ('Content-Type', 'application/json');
				res.json(dish);	

			}, (err)=> next(err));
		}
		else if (dish == null) {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);	//this will go to app.js and will be handled by the error handler
		}
		else{//comment does not exist
			err = new Error('Comment' + req.params.commentId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, (err)=> next(err))
    .catch((err) => next(err));
})


.delete( (req,res,next) => {
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null && dish.comments.id(req.params.commentId)!=null ){	//dish, comment, comment with that id exits
			dish.comments.id(req.params.commentId). remove();
			dish.save()
			.then((dish)=>{
				res.statusCode = 200;
				res.setHeader ('Content-Type', 'application/json');
				res.json(dish);	

			}, (err)=> next(err));

			
		}
		else if (dish == null) {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);	//this will go to app.js and will be handled by the error handler
		}
		else{//comment does not exist
			err = new Error('Comment' + req.params.commentId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, (err)=> next(err))
    .catch((err) => next(err));
});
module.exports = dishRouter;
