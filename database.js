'use strict'
const mongoose =require('mongoose')
// const MONGODB_URL='mongodb://localhost:27017/reddit-clone';

const MONGODB_URL = 'mongodb://reddit:jalapeno@ds033116.mlab.com:33116/redditclone'

mongoose.Promise = Promise


module.exports.connect=()=>mongoose.connect(MONGODB_URL)

module.exports.disconnect = () => mongoose.disconnect()
