const {Router} = require('express');

const router = Router()
router.get('/', (req, res) =>
  res.render('index')
)

router.get('/post', (req, res) =>
  res.render('post')
)

router.post('/post', (req, res, err) => {
  console.log("HI")
})

module.exports=router;
