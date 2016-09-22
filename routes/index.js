const {Router} = require('express');
const postModel = require('../models/post')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const router = Router()

router.get('/', (req, res) => {
  postModel.find().sort({upvotes: -1})
  .then((data) => {
    res.render("index", {data} )
  })
  .catch(console.error);
});

router.get('/comments/:id', (req, res, err) => {
  let postID = req.params.id
  postModel.findById(postID)
  .then(data=>{
    data.postID=postID
    res.render("comments",data)
  })
})

router.get('/register', (req, res) =>
  res.render('register')
)

router.get('/login', (req, res) =>
  res.render('login')
)

router.post('/login', ({ session, body: { email, password } }, res, err) => {
  User.findOne({ email })
    .then(user => {
      if (user) {
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, matches) => {
            if (err) {
              reject(err)
            } else {
              resolve(matches)
            }
          })
        })
      } else {
        res.render('login', { msg: 'Email does not exist in our system' })
      }
    })
    .then((matches) => {
      if (matches) {
        session.email = email
        res.redirect('/')
      } else {
        res.render('login', { msg: 'Password does not match' })
      }
    })
    .catch(err)
})


router.get('/post', (req, res) =>
  res.render('post')
)


router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err
    res.redirect('/login')
  })
})

// login guard middleware
router.use((req, res, next) => {
  if (req.session.email) {
    next()
  } else {
    res.redirect('/login')
  }
})


router.post('/comments/:id', (req, res, err) => {
  let postID = req.params.id
  let postedData = postModel.findById(postID)
  .then(data=>{
    console.log(req.body)
    data.comments.push(req.body)
    data.save()
    res.render("comments",data)
  })
})

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

router.get('/logout', (req, res) =>
  res.render('logout', { page: 'Logout'})
)



module.exports=router;
