const {Router} = require('express');
const postModel = require('../models/post')


const router = Router()
router.get('/', (req, res) => {
  postModel.find().sort({upvotes: -1})
  .then((data) => {
    res.render("index", {data} )
  })
  .catch(console.error);
});



router.get('/post', (req, res) =>
  res.render('post')
)

router.post('/post', (req, res, err) => {
  const post = new postModel(req.body)
  post.save()
  .then(res.redirect('/'))
  .catch(err=>console.log(err))
})


router.post('/:id/down', (req, res, err) => {
  let postID = req.params.id;
  postModel.findById(postID, (err, data) => {
    data.upvotes--;
    data.save((err) => {
      if (err)
      res.redirect("/")
    })
  })
  .then(
    res.redirect('/')
  )
  .catch(err=>console.log(err))
})


router.post('/:id/up', (req, res, err) => {
  let postID = req.params.id;
  postModel.findById(postID, (err, data) => {
    data.upvotes++;
    data.save((err) => {
      if (err)
      res.redirect("/")
    })
  })
  .then(
    res.redirect('/')
  )
  .catch(err=>console.log(err))
})



module.exports=router;
