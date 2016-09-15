const {Router} = require('express');
const postModel = require('../models/post')
const upvote = require('../models/upvote')

const router = Router()
router.get('/', (req, res) =>
	Promise.all([
		postModel.find(),
		upvote.find()]).
	then(([data,upvotes])=>{
		// Object.keys(upvotes).forEach((vote)=>{
		// 	console.log(upvotes[vote])
		// })
		res.render('index',{data,upvotes})
	})
  
)

router.get('/post', (req, res) =>
  res.render('post')
)

router.post('/post', (req, res, err) => {
  const post = new postModel(req.body)
  post.save()
  .then(res.redirect('/'))
  .catch(err=>console.log(err))
})

router.post('/', (req, res, err) => {
	let dataArray;
	let data = req.body.upvote
	data=data.slice(1,data.length-1)
	dataArray=data.split(',')
	let upvoteObj=
	{
		id:dataArray[1],
		upvote:dataArray[0]
	}
	const vote = new upvote(upvoteObj);
	vote.save();
})



module.exports=router;
