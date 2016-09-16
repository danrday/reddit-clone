const express = require('express');
const routes = require('./routes/')
const connect = require('./database').connect
const { cyan, red } = require('chalk')
const bodyParser = require('body-parser')

const app=express()
app.set('view engine','pug')
const port = process.env.PORT || 3000
app.set('port', port)

//middleware
app.use(({ method, url, headers: { 'user-agent': agent } }, res, next) => {
  const timeStamp = new Date()
  console.log(`[${timeStamp}] "${cyan(`${method} ${url}`)}" "${agent}"`)
  next()
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(routes)


// Custom 404 page
app.use((req, res) =>
  res.render('404')
)

// Error handling middleware
app.use((
    err,
    { method, url, headers: { 'user-agent': agent } },
    res,
    next
  ) => {
    res.sendStatus(err.status || 500)
    const timeStamp = new Date()
    const statusCode = res.statusCode
    const statusMessage = res.statusMessage
    console.error(
      `[${timeStamp}] "${red(`${method} ${url}`)}" Error (${statusCode}): "${statusMessage}"`
    )
    console.error(err.stack)
  }
)

// Listen to requests on the provided port and log when available
connect().then(()=>{
  app.listen(port, () =>{
     console.log(`Listening on port: ${port}`)
  }

)
}).catch(console.error)
