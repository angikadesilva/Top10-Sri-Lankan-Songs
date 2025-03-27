const chai = require('chai');
const expect = chai.expect;  // Using expect for consistency
const request = require('supertest');
const app = require('../app');  // Your Express app

describe('POST /songs', function() {
  it('should insert a new song into the database with all required fields', function(done) {
    const newSong = {
      title: "Anganawo",
      artist: "Rukantha",
      genre: "Pop",
      release_year: 2023,
      youtube_views: 500000,
      decade: "2020s"
    };

    // Send the POST request to create a new song
    request(app)  // Use your Express app
      .post('/api/songs')  // Assuming the correct endpoint is /api/songs
      .send(newSong)  // Send the song data in the request body
      .expect('Content-Type', /json/)  // Expect a JSON response
      .expect(201)  // Expect status 201 Created
      .end(function(err, res) {
        if (err) return done(err);

        // Assertions to check if the response contains the correct data
        expect(res.body).to.have.property('id');  // Check if response includes the id of the new song
        expect(res.body.title).to.equal(newSong.title);  // Verify the title
        expect(res.body.artist).to.equal(newSong.artist);  // Verify the artist
        expect(res.body.genre).to.equal(newSong.genre);  // Verify the genre
        expect(res.body.release_year).to.equal(newSong.release_year);  // Verify the release year
        expect(res.body.youtube_views).to.equal(newSong.youtube_views);  // Verify the views
        expect(res.body.decade).to.equal(newSong.decade);  // Verify the decade

        // Manually check the database (optional, can be done using another query)
        request(app)
          .get(`/api/songs/${res.body.id}`)  // Assuming you have an endpoint to fetch song by ID
          .expect(200)
          .end(function(dbErr, dbRes) {
            if (dbErr) return done(dbErr);

            // Verify the song data in the database (this assumes your database query is working)
            expect(dbRes.body.title).to.equal(newSong.title);
            expect(dbRes.body.artist).to.equal(newSong.artist);
            expect(dbRes.body.genre).to.equal(newSong.genre);
            expect(dbRes.body.release_year).to.equal(newSong.release_year);
            expect(dbRes.body.youtube_views).to.equal(newSong.youtube_views);
            expect(dbRes.body.decade).to.equal(newSong.decade);
            done();
          });
      });
  });
});
