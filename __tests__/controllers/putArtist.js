const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { put } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist PUT Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  it('updates artist record', (done) => {
    // expect.assertions(2);
    const artist = new Artist({ name: 'tikitavi', genre: 'tralala' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'something went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'PUT',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'tikitavi',
          genre: 'nananala',
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      put(request, response);
      response.on('end', () => {
            const updatedArtist = JSON.parse(response._getData()); //eslint-disable-line
        expect(updatedArtist).toEqual({
          __v: 0,
          _id: artistCreated._id.toString(),
          name: 'tikitavi',
          genre: 'nananala',
        });
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
