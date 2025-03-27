const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../app');  // Your Express app

describe('Songs API', function() {

  // Test case for POST /songs (Adding a new song)
  describe('POST /songs', function() {
    it('should insert a new song into the database', function(done) {
      const newSong = {
        title: "New Song",
        artist: "Artist Name",
        genre: "Pop",
        release_year: 2023,
        youtube_views: 500000,
        decade: '2020s'
      };

      request(app)  // Use your Express app
        .post('/api/songs')  // The endpoint you want to test
        .send(newSong)  // Send the song data in the request body
        .expect('Content-Type', /json/)  // Expect a JSON response
        .expect(201)  // Expect status 201 Created
        .end(function(err, res) {
          if (err) return done(err);

          // Assertions to check if response is correct
          assert.property(res.body, 'id');  // Check if response includes the id of the new song
          assert.equal(res.body.title, newSong.title);  // Verify the title
          assert.equal(res.body.artist, newSong.artist);  // Verify the artist
          assert.equal(res.body.genre, newSong.genre);  // Verify the genre
          assert.equal(res.body.release_year, newSong.release_year);  // Verify the release year
          assert.equal(res.body.youtube_views, newSong.youtube_views);  // Verify the youtube views
          assert.equal(res.body.decade, newSong.decade);  // Verify the decade

          done();
        });
    });

    it('should return 400 for missing required fields', function(done) {
      const incompleteSong = {
        title: "Incomplete Song"  // Missing other required fields like artist, views
      };

      request(app)
        .post('/api/songs')
        .send(incompleteSong)
        .expect('Content-Type', /json/)
        .expect(400)  // Expect status 400 for missing fields
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.error, 'All fields are required');
          done();
        });
    });

    it('should return 400 for invalid release year', function(done) {
      const invalidSong = {
        title: "Invalid Year Song",
        artist: "Artist Name",
        genre: "Pop",
        release_year: "InvalidYear",  // Invalid release year
        youtube_views: 100000,
        decade: '2020s'
      };

      request(app)
        .post('/api/songs')
        .send(invalidSong)
        .expect('Content-Type', /json/)
        .expect(400)  // Expect status 400 for invalid release year
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.error, 'Invalid release year');
          done();
        });
    });

    it('should return 400 for invalid youtube views', function(done) {
      const invalidSong = {
        title: "Invalid Views Song",
        artist: "Artist Name",
        genre: "Pop",
        release_year: 2023,
        youtube_views: -5000,  // Invalid youtube views (negative number)
        decade: '2020s'
      };

      request(app)
        .post('/api/songs')
        .send(invalidSong)
        .expect('Content-Type', /json/)
        .expect(400)  // Expect status 400 for invalid youtube views
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.error, 'Invalid youtube views');
          done();
        });
    });

    it('should return 400 for invalid decade', function(done) {
      const invalidSong = {
        title: "Invalid Decade Song",
        artist: "Artist Name",
        genre: "Pop",
        release_year: 2023,
        youtube_views: 500000,
        decade: '2050s'  // Invalid decade
      };

      request(app)
        .post('/api/songs')
        .send(invalidSong)
        .expect('Content-Type', /json/)
        .expect(400)  // Expect status 400 for invalid decade
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.error, "Invalid decade. Valid options are: '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'.");
          done();
        });
    });
  });

  // Test case for GET /songs (Getting the top songs)
  describe('GET /songs', function() {
    it('should return a list of top 10 songs', function(done) {
      request(app)
        .get('/api/songs')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isArray(res.body);
          assert.isAtMost(res.body.length, 10);  // Verify there are no more than 10 songs
          done();
        });
    });

    it('should return the correct number of songs based on limit query', function(done) {
      request(app)
        .get('/api/songs?limit=5')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isArray(res.body);
          assert.equal(res.body.length, 5);  // Verify there are exactly 5 songs
          done();
        });
    });
  });

  // Test case for GET /songs/:id (Getting a specific song by ID)
  describe('GET /songs/:id', function() {
    it('should return a song by its ID', function(done) {
      const songId = 1;  // Use an existing song ID in the database for testing
      request(app)
        .get(`/api/songs/${songId}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.property(res.body, 'id');
          assert.equal(res.body.id, songId);
          done();
        });
    });

    it('should return 404 if the song is not found', function(done) {
      const songId = 99999;  // Use an ID that doesn't exist in the database
      request(app)
        .get(`/api/songs/${songId}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.message, 'Song not found');
          done();
        });
    });
  });

  // Test case for PUT /songs/:id (Updating a song)
  describe('PUT /songs/:id', function() {
    it('should update an existing song', function(done) {
      const updatedSong = {
        title: "Updated Song",
        artist: "Updated Artist",
        genre: "Rock",
        release_year: 2022,
        youtube_views: 1000000,
        decade: '2020s'
      };

      const songId = 1;  // Use an existing song ID in the database for testing
      request(app)
        .put(`/api/songs/${songId}`)
        .send(updatedSong)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.message, 'Song updated successfully');
          done();
        });
    });

    it('should return 404 if the song to update is not found', function(done) {
      const updatedSong = {
        title: "Non-existent Song",
        artist: "Unknown Artist",
        genre: "Pop",
        release_year: 2021,
        youtube_views: 100000,
        decade: '2020s'
      };

      const songId = 99999;  // Use an ID that doesn't exist
      request(app)
        .put(`/api/songs/${songId}`)
        .send(updatedSong)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.message, 'Song not found');
          done();
        });
    });
  });

  // Test case for DELETE /songs/:id (Deleting a song)
  describe('DELETE /songs/:id', function() {
    it('should delete a song by ID', function(done) {
      const songId = 1;  // Use an existing song ID in the database for testing
      request(app)
        .delete(`/api/songs/${songId}`)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.message, 'Song deleted successfully');
          done();
        });
    });

    it('should return 404 if the song to delete is not found', function(done) {
      const songId = 99999;  // Use an ID that doesn't exist
      request(app)
        .delete(`/api/songs/${songId}`)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.message, 'Song not found');
          done();
        });
    });
  });

});
