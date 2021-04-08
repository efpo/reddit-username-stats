
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
//ERROR HANDLING
//TESTING
//CLEAN UP

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
  const filter = req.query.filter
  //example: GovSchwarzenegger

  allComments = await getItems('comments', username)
  allPosts = await getItems('submitted', username)

  var result = {}
  if(filter != null){
    filterResourcesComments = await filterResources(filter, allComments)
    filterResourcesPosts = await filterResources(filter, allPosts)
    result = {
      comment_stats: await calculateResourceData(filterResourcesComments, 'comments'),
      post_stats: await calculateResourceData(filterResourcesPosts, 'submitted'),
      comments: await editFilteredData(filter, filterResourcesComments),
      posts: await editFilteredData(filter, filterResourcesPosts)
    }
  } else {
      result = {
        comment_stats: await calculateResourceData(allComments, 'comments'),
        post_stats: await calculateResourceData(allPosts, 'submitted')
    }
  }

  res.json(result);
});

async function getItems(resourceType, username){
  console.log('getItems called with ', resourceType, username )
  allResources = []
  noOfResources = 0
  afterID = 0

  while(true){
    await getResources(afterID, username, resourceType).then(result => {
      afterID = result.data.after
      noOfResources = Object.keys(result.data.children).length
      allResources= allResources.concat(result.data.children)
    })
    if(noOfResources != 100){
      break
    }
  }
  return allResources
}

async function getResources(afterID, username, resourceType){
  console.log('getResources called with ', resourceType, username)
  return await reddit.get('/user/' + username + '/' + resourceType, {
    context: 4,
    show: 'given',
    sort: 'new',
    t: 'all',
    type: resourceType,
    username: username,
    after: afterID,
    // before:,
    // count:,
    limit: 100,
  })
}


function calculateResourceData(resources, resourceType){

    subCount = countSubreddits(resources)

    subCountAndMostPostedSub = countKarmaAndMostPostedSubreddit(subCount)

    highestKarma = findHighestKarma(resources, resourceType)

  return ({
    total: sumKarma,
    most_posted_subreddit: subCountAndMostPostedSub.mostPostedSubreddit,
    posted_per_subreddit: subCountAndMostPostedSub.subCount,
    highest_karma: {
      score: highestKarma.highestKarma,
      link: highestKarma.highestKarmaLink,
      text: highestKarma.highestKarmaText
    }
  })
}

function countSubreddits(resources){
  //counting total resources for each subreddit
  subCount = {}
  for(var i = 0; i < resources.length; i++){
    if(subCount[resources[i].data.subreddit]){
      subCount[resources[i].data.subreddit] = subCount[resources[i].data.subreddit] + 1
      }
    else {
      subCount[resources[i].data.subreddit] = 1
      }
    }

    return subCount
}

function countKarmaAndMostPostedSubreddit(subCount){

  //counting total resources & top posted sub
  sumKarma = 0
  mostPostedSubreddit = {}
  for(const [key, value] of Object.entries(subCount)){
    if(Object.keys(mostPostedSubreddit).length === 0){
      mostPostedSubreddit[key] = value
    }
    else if(value > mostPostedSubreddit[key]){
        mostPostedSubreddit[key] = value
    }
    sumKarma += value
  }

  result = {sumKarma: sumKarma, mostPostedSubreddit: mostPostedSubreddit}

  return result

}

function findHighestKarma(resources, resourceType){

  //finding highest rated resource
  highestKarma = 0
  for(var i = 0; i < resources.length; i++){
    if(resources[i].data.score > highestKarma){
      highestKarma = resources[i].data.score
      highestKarmaLink = resources[i].data.permalink
      if(resourceType === 'submitted'){
        highestKarmaText = resources[i].data.title
      } else {
        highestKarmaText = resources[i].data.body
      }
    }
  }

  result = {highestKarma: highestKarma, highestKarmaLink: highestKarmaLink,
     highestKarmaText: highestKarmaText}

  return result

}

function filterResources(filter, allResources){
  filteredResources = []
  for(var i = 0; i < allResources.length; i++){
    if(filter === allResources[i].data.subreddit){
      filteredResources = filteredResources.concat(allResources[i])
    }
  }

  return filteredResources
}

function editFilteredData(filter, allResources){
  filteredResources = []
  for(var i = 0; i < allResources.length; i++){
    filteredResources = filteredResources.concat({subreddit: allResources[i].data.subreddit,
    karma: allResources[i].data.score, title: allResources[i].data.title,
    comment: allResources[i].data.body, link: allResources[i].data.permalink})
  }

  return filteredResources
}


app.listen(3000, function() {
    console.log("App started")
});


module.exports = app
