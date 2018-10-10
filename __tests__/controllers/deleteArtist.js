const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { deleteArtist } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist PUT Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  it('deletes artist record', (done) => {
    const artist = new Artist({ name: 'tikitavi', genre: 'tralala' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'something went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'DELETE',
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
      deleteArtist(request, response);
      response.on('end', () => {
        Artist.findById(artistCreated._id, (err, noSuchArtist) => {
          expect(noSuchArtist).toBe(null);
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
});
