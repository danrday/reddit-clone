'use strict';

const mongoose=require('mongoose');

module.exports=mongoose.model('Post',{
	title:String,
	description:String,
	image:String
})
