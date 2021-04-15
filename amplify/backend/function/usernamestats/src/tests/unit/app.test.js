//const calculateResourceData = require('../calculateResourceData')
const sum = require('../../app').sum
const calculateResourceData = require('../../app').calculateResourceData
const filterResources = require('../../app').filterResources
const allComments = require('./rawdata-comments.json')
const allPosts = require('./rawdata-posts.json')
const outputComments = require('./output-comments.json')
const outputPosts = require('./output-posts.json')
const filteredComments_Raw = require('./rawdata-filtercomments.json')

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
})

test('checks calculateResourceData has correct output for comments', () => {
  expect(calculateResourceData(allComments, 'comments')).toEqual(outputComments)
})

test('checks calculateResourceData has correct output for posts', () => {
  expect(calculateResourceData(allPosts, 'submitted')).toEqual(outputPosts)
})

test('checks filterResources has correct output for posts', () => {
  expect(filterResources('houseplants', allComments)).toEqual(filteredComments_Raw)
})
