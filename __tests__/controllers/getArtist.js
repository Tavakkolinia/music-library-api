const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { get } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist GET Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  it('should get the Artist', (done) => {
    expect.assertions(2);
    const artist = new Artist({ name: 'tititu', genre: 'tralala' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'something went wrong');
      }

      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id,
        },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });


      get(request, response);

      response.on('end', () => {
        const artistFound = JSON.parse(response._getData());
        expect(artistFound.name).toBe('tititu');
        expect(artistFound.genre).toBe('tralala');
        done();
      });
    });
  });
});
afterEach((done) => {
  Artist.collection.drop((e) => {
    if (e) {
      console.log(e);
    }
    done();
  });
});
afterAll(() => {
  mongoose.connection.close();
});
