const express = require('express');
const routes = require('./routes/')
const {connect} = require('./database')
const { cyan, red } = require('chalk')
const bodyParser = require('body-parser')

const app=express()
app.set('view engine','pug')


//middleware
app.use(({ method, url, headers: { 'user-agent': agent } }, res, next) => {
  const timeStamp = new Date()
  console.log(`[${timeStamp}] "${cyan(`${method} ${url}`)}" "${agent}"`)
  next()
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(routes)
app.listen(3000)
