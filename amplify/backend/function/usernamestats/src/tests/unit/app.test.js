//const calculateResourceData = require('../calculateResourceData')
const calculateResourceData = require('../../app').calculateResourceData
const filterResources = require('../../app').filterResources
const editFilteredData = require('../../app').editFilteredData
const allComments = require('./rawdata-comments.json')
const allPosts = require('./rawdata-posts.json')
const outputComments = require('./output-comments.json')
const outputPosts = require('./output-posts.json')
const filteredComments_Raw = require('./rawdata-filtercomments.json')
const filteredPosts_Raw = require('./rawdata-filterposts.json')
const filteredComments = require('./output-editfilteredcomments.json')
const filteredPosts = require('./output-editfilteredposts.json')

test('checks calculateResourceData has correct output for comments', () => {
  expect(calculateResourceData(allComments, 'comments')).toEqual(outputComments)
})

test('checks calculateResourceData has correct output for posts', () => {
  expect(calculateResourceData(allPosts, 'submitted')).toEqual(outputPosts)
})

test('checks filterResources has correct output for comments', () => {
  expect(filterResources('houseplants', allComments)).toEqual(filteredComments_Raw)
})

test('checks filterResources has correct output for posts', () => {
  expect(filterResources('houseplants', allPosts)).toEqual(filteredPosts_Raw)
})

test('checks editFilterResources has correct output for comments', () => {
  expect(editFilteredData('houseplants', filteredComments_Raw)).toEqual(filteredComments)
})

test('checks editFilterResources has correct output for posts', () => {
  expect(editFilteredData('houseplants', filteredPosts_Raw)).toEqual(filteredPosts)
})
