const getResources = require('../../app').getResources
const reddit = require('../../app').reddit
const UserNotFoundError = require('../../app').UserNotFoundError
const allComments = require('../unit/rawdata-comments.json')

test("fetches results from reddit api", async (done) => {

  reddit.get = jest.fn().mockResolvedValue(allComments);
  let afterID = 0;
  let username = 'hscheel'
  let resourceType = 'comments'
  await getResources(afterID, username, resourceType).then(response => {
    expect(response).toEqual(allComments);
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

test("returns correct error message when trying to fetch results from reddit api", async (done) => {

  reddit.get = jest.fn().mockImplementation( () => {
    throw new Error('API error: Not Found. Status code: 404');
  });
  let afterID = 0;
  let username = 'hsch4566eel'
  let resourceType = 'comments'
  await expect(getResources(afterID, username, resourceType))
  .rejects.toThrow(UserNotFoundError);
  done()
});
