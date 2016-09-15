const mongoose=require('mongoose');

module.exports=mongoose.model('Upvote',{
	id:String,
	upvote:Boolean

})
