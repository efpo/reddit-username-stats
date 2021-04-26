const getResources = require('../../app').getResources
const reddit = require('../../app').reddit

const allComments = require('../unit/rawdata-comments.json')

test("fetches results from reddit api", async (done) => {

  reddit.get = jest.fn().mockResolvedValue('hello');
  let afterID = 0;
  let username = 'hscheel'
  let resourceType = 'comments'
  await getResources(afterID, username, resourceType).then(response => {
    expect(response).toEqual('hello');
    expect(reddit.get).toHaveBeenCalledTimes(1);
    expect(reddit.get).toHaveBeenCalledWith(
          '/user/' + username + '/' + resourceType,
          {
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
        });
        done()
});
