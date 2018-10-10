const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');

exports.post = (req, res) => {
  const artist = new Artist({ name: req.body.name, genre: req.body.genre });
  artist.save((err, artistCreated) => {
    res.json(artistCreated);
  });
};
exports.list = (req, res) => {
  Artist.find({}, (err, artists) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(artists);
  });
};
exports.get = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(artist);
  });
};
exports.put = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    artist.set({ name: req.body.name });
    artist.set({ genre: req.body.genre });

    artist.save((updateErr, artistUpdated) => {
      if (updateErr) {
        res.json('Could not update');
      }

      res.json(artistUpdated);
    });
  });
};
exports.deleteArtist = (req, res) => {
  Artist.findByIdAndRemove(req.params.artistId, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.json('deleted');
    }
  });
};
exports.postAlbum = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Artist does not exist');
    }
    const myAlbum = new Album({
      artist,
      name: req.body.name,
      year: req.body.year,
    });

    myAlbum.save((createErr, createdAlbum) => {
      if (createErr) {
        res.json('Could not create an album');
      }

      res.json(createdAlbum);
    });
  });
};
exports.postSong = (req, res) => {
  Album.findById(req.params.albumId, (albumNotFoundErr, album) => {
    if (albumNotFoundErr) {
      res.json('Album does not exist');
    }
    Artist.findById(req.body.artistId, (artistNotFoundErr, artist) => {
      if (artistNotFoundErr) {
        res.json('Artist does not exist');
      }

      const mySong = new Song({
        name: req.body.name,
        artist,
        album,
      });

      mySong.save((createErr, createdSong) => {
        if (createErr) {
          res.json('Could not save song');
        }

        res.json(createdSong);
      });
    });
  });
};
exports.getAlbums = (req, res) => {
  Album.find({ artist: req.params.artistId }).populate('artist').exec((err, albums) => {
    if (err) {
      res.json('Unable to retrieve albums');
    }

    res.json(albums);
  });
};

