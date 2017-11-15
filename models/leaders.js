const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);//this will load this new currency type into mongoose
const Currency = mongoose.Types.Currency;//



const leaderSchema = new Schema({
	name:{
		type: String,
		required: true,
		unique: true
	},
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    abbr: {
        type: String,
        default: ''
    },
	description:{
		type: String,
		required: true
	},   
    featured: {
        type: Boolean,
        default:false      
    },

},{
    timestamps: true
});

//creating the model from this schema
var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;