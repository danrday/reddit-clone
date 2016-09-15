const {Router} = require('express');
const postModel = require('../models/post.js')

const router = Router()
router.get('/', (req, res) =>
  postModel.find()
  .then(data=>res.render('index',{data}))

  
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

module.exports=router;
