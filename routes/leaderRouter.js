const express = require ('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//all the following is just the one group, just to avoid any mismatch (/leaderes or /leader)
//further we need to mount this router in the index.js
leaderRouter.route('/')
.all((req, res, next)=>{ //for /leaderes , all means for all get, post, put, delete do this
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next(); // this asks the function to look further for the /leaderes callbacks
})

//because of the next(), program will execute this also
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})

.post((req, res, next) => {	//req.body has parsed the json data
	res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req, res, next) => {	
	res.statusCode = 403;	
	res.end('Put operation is not supported on /leaders');
})

.delete((req,res,next) => {
    res.end('Deleting all the leaders!');
});

//for leaderIDs
leaderRouter.get('/:leaderId', (req,res,next) => {
    res.end('Will send details of the leader: '+ req.params.leaderId + ' to you!');
});

leaderRouter.post('/:leaderId', (req, res, next) => {	//req.body has parsed the json data
	res.statusCode = 403;	
	res.end('Post operation is not supported on /leaders/'+ req.params.leaderId);});

leaderRouter.put('/:leaderId', (req, res, next) => {	
	res.write('Updating the leader: '+ req.params.leaderId + '\n');
	res.end('Will update the leader '+ req.body.name + 'with details: '+ req.body.description);
});

leaderRouter.delete('/:leaderId', (req,res,next) => {
    res.end('Deleting leader:' + req.params.leaderId);
});


module.exports = leaderRouter;
