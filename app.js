const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const artist = require('./controllers/Artist');
const artistController = require('./controllers/Artist');
const artistId = require('./controllers/Artist');


require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

const app = express();

mongoose.connect(process.env.DATABASE_CONN);
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello MongoDb!'));
app.post('/Artist', artist.post);
app.get('/Artist', artistController.list);
app.get('/Artist/:artistId', artistId.get);
app.put('/Artist/:artistId', artistController.put);
app.delete('/Artist/:artistId', artistController.deleteArtist);
//app.postAlbum('/Artist/:artistId/albums', artistController.postAlbum);
app.listen(3000, () => console.log('It works!'));
