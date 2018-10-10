const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('POST Album Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });
  it('should add an album to an Artist', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'POST',
        URL: `/artist/${artistCreated._id}/album`,
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Ghost Stories',
          year: 2014,
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      postAlbum(request, response);

      response.on('end', () => {
        const albumCreated = JSON.parse(response._getData()); //eslint-disable-line
        expect(albumCreated.name).toEqual('Ghost Stories');
        expect(albumCreated.year).toEqual(2014);
        expect(albumCreated.artist._id).toEqual(artistCreated._id.toString()); //eslint-disable-line
        done();
      });
    });
  });
});
afterEach((done) => {
  Artist.collection.drop((artistDropErr) => {
    Album.collection.drop((albumDropErr) => {
      if (artistDropErr || albumDropErr) {
        console.log('Can not drop test collections');
      }
      done();
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
