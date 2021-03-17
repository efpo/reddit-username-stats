
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var Reddit = require('reddit')
require('dotenv').config();

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const reddit = new Reddit({
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
  appId: process.env.REDDIT_APPID,
  appSecret: process.env.REDDIT_APPSECRET,
  userAgent: 'usernamestats/1.0.0'
})

app.get('/stats', async function(req, res) {

  const username = req.query.username
  //example: GovSchwarzenegger

  allComments = []
  noOfComments = 0
  afterID = 0
  while(true){
    await getComments(afterID, username).then(result => {
      afterID = result.data.after
      noOfComments = Object.keys(result.data.children).length
      allComments = allComments.concat(result.data.children)
    })
    if(noOfComments != 100){
      break
    }
  }
  res.json(calculateCommentData(allComments));
});

async function getComments(afterID, username){
  return await reddit.get('/user/' + username + '/comments', {
    context: 4,
    show: 'given',
    sort: 'new',
    t: 'all',
    type: 'comments',
    username: username,
    after: afterID,
    // before:,
    // count:,
    limit: 100,
  })
}

function calculateCommentData(comments){

  //counting total comments for each subreddit
  subCount = {}
  for(i = 0; i < comments.length; i++){
    if(subCount[comments[i].data.subreddit]){
      subCount[comments[i].data.subreddit] = subCount[comments[i].data.subreddit] + 1
      }
    else {
      subCount[comments[i].data.subreddit] = 1
      }
    }

  //counting total comments & top commented sub
  sumComments = 0
  mostCommentedSubreddit = {}
  for(const [key, value] of Object.entries(subCount)){
    if(Object.keys(mostCommentedSubreddit).length === 0){
      mostCommentedSubreddit[key] = value
      }
    else if(value > mostCommentedSubreddit[key]){
        mostCommentedSubreddit[key] = value
      }
      sumComments += value
  }

  //finding highest rated comment
  highestKarma = 0
  for(i = 0; i < comments.length; i++){
    if(comments[i].data.score > highestKarma){
      highestKarma = comments[i].data.score
      highestKarmaLink = comments[i].data.link_permalink
      highestKarmaText = comments[i].data.body
    }
  }

  return ({
    total_comments: sumComments,
    most_commented_subreddit: mostCommentedSubreddit,
    comments_per_subreddit: subCount,
    highest_karma: {
      score: highestKarma,
      link: highestKarmaLink,
      text: highestKarmaText
    }
  })
}


app.listen(3000, function() {
    console.log("App started")
});


module.exports = app
