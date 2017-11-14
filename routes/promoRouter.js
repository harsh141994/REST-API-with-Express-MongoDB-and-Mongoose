const express = require ('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//all the following is just the one group, just to avoid any mismatch (/promoes or /promo)
//further we need to mount this router in the index.js
promoRouter.route('/')
.all((req, res, next)=>{ //for /promoes , all means for all get, post, put, delete do this
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next(); // this asks the function to look further for the /promoes callbacks
})

//because of the next(), program will execute this also
.get((req,res,next) => {
    res.end('Will send all the promos to you!');
})

.post((req, res, next) => {	//req.body has parsed the json data
	res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req, res, next) => {	
	res.statusCode = 403;	
	res.end('Put operation is not supported on /promos');
})

.delete((req,res,next) => {
    res.end('Deleting all the promos!');
});

//for promoIDs
promoRouter.get('/:promoId', (req,res,next) => {
    res.end('Will send details of the promo: '+ req.params.promoId + ' to you!');
});

promoRouter.post('/:promoId', (req, res, next) => {	//req.body has parsed the json data
	res.statusCode = 403;	
	res.end('Post operation is not supported on /promos/'+ req.params.promoId);});

promoRouter.put('/:promoId', (req, res, next) => {	
	res.write('Updating the promo: '+ req.params.promoId + '\n');
	res.end('Will update the promo '+ req.body.name + 'with details: '+ req.body.description);
});

promoRouter.delete('/:promoId', (req,res,next) => {
    res.end('Deleting promo:' + req.params.promoId);
});


module.exports = promoRouter;
