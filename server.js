const express = require('express');
const routes = require('./routes/')
const {connect} = require('./database')
const bodyParser = require('body-parser')

const app=express()

app.listen(3000)
