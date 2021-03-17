
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

app.get('/username', function(req, res) {
  //allComments = {}
//GovSchwarzenegger
//robotekia
  reddit.get('/user/GovSchwarzenegger/comments', {
    context: 4,
    show: 'given',
    sort: 'new',
    t: 'all',
    type: 'comments',
    username: 'GovSchwarzenegger',
    //after: 't1_gcqt68c',
    // before:,
    // count:,
    limit: 100,
  }).then(async result => {
      //console.log(JSON.stringify(res.data, null, 4))
      //console.log(JSON.stringify(res.data.children[0].data.subreddit, null, 4))
      noOfComments = Object.keys(result.data.children).length
      //console.log('children length ', Object.keys(result.data.children).length)
      //console.log('afterid ', result.data.after)
      allComments = result.data.children
      //console.log("FIRST PRINT  ", allComments)
      //console.log("comment length ", Object.keys(allComments).length)
      //getComments(result.data.after)
      afterID = result.data.after
      while(noOfComments === 100){
        //console.log('here')
          await getComments(afterID).then(result => {
            afterID = result.data.after
            noOfComments = Object.keys(result.data.children).length
            //a = a.concat([5, 4, 3]);
            allComments = allComments.concat(result.data.children)
            //console.log("IN WHILE LOOP  ", allComments)
            //console.log(allComments.length)
            //console.log("NO OF COMMENTS: ", Object.keys(result.data.children).length)
          })

      }
      //console.log("DONE ", allComments.length)

      //res.json(calculateCommentData(result.data));
      res.json(calculateCommentData(allComments));
      //console.log(result.data.after)
  })
});

async function getComments(afterID){
  //make request
  //check length of request
  //if length is 100, get id of last comment in the list
  //add to next request
  //if <100, stop requesting

  return await reddit.get('/user/GovSchwarzenegger/comments', {
    context: 4,
    show: 'given',
    sort: 'new',
    t: 'all',
    type: 'comments',
    username: 'GovSchwarzenegger',
    after: afterID,
    // before:,
    // count:,
    limit: 100,
  })
}

function calculateCommentData(comments){

  commentChildren = comments

  //counting total comments for each subreddit
  subCount = {}
  for(i = 0; i < commentChildren.length; i++){
    if(subCount[comments[i].data.subreddit]){
      subCount[comments[i].data.subreddit] = subCount[comments[i].data.subreddit] + 1
      }
    else {
      subCount[comments[i].data.subreddit] = 1
      }
    }
  //console.log(JSON.stringify(subCount))


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
  //console.log(sumComments, mostCommentedSubreddit)

  //finding highest rated comment
  highestKarma = 0
  for(i = 0; i < commentChildren.length; i++){
    if(comments[i].data.score > highestKarma){
      highestKarma = comments[i].data.score
      highestKarmaLink = comments[i].data.link_permalink
      highestKarmaText = comments[i].data.body
    }
  }

  //console.log(highestKarma, highestKarmaLink, highestKarmaText)



  return ({total_comments: sumComments, most_commented_subreddit: mostCommentedSubreddit, comments_per_subreddit: subCount, highest_karma: {score: highestKarma, link: highestKarmaLink, text: highestKarmaText}})

}


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
