const {Router} = require('express');
const postModel = require('../models/post')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

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

router.post('/login', (req, res, next) =>
  passport.authenticate('local', (err, user, msg) => {
    if (err) { return next(err) }
    if (!user) { return res.render('login', msg) }

    req.logIn(user, err => {
      if (err) { return next(err) }
      res.redirect('/')
    })
  })(req, res, next))


router.get('/post', (req, res) =>
  res.render('post')
)


router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err
    res.redirect('/login')
  })
})

router.post('/register', ({ body: { email, password, confirmation } }, res, err) => {
  if (password === confirmation) {
    User.findOneByEmail(email)
      .then(user => {
        if (user) {
          return res.render('register', { msg: 'Email is already registered' })
        }

        return User.create({ email, password })
      })
      .then(() => res.redirect('/login'))
      .catch(err)
  } else {
    res.render('register', { msg: 'Password & password confirmation do not match' })
  }
})

// login guard middleware
router.use((req, res, next) => {
  if (req.user.email) {
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
