const request = require('supertest');
const app = require('../app'); // Adjust the path as needed for your app

describe('SQL Injection Tests for Songs API', function () {

  // Test SQL injection via song ID in GET request
  it('should not allow SQL injection via songId in GET /songs/:id', function (done) {
    const maliciousInput = "1' OR '1'='1"; // Example SQL injection payload

    request(app)
      .get(`/api/songs/${maliciousInput}`)  // Assuming your route is like /api/songs/:id
      .expect(400)  // Expecting Bad Request or a relevant status code
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  // Test SQL injection via song title in POST request
  it('should not allow SQL injection via title in POST /songs', function (done) {
    const maliciousInput = "maliciousTitle'; DROP TABLE songs; --"; // SQL injection payload

    request(app)
      .post('/api/songs')  // Assuming your route is POST /api/songs
      .send({ title: maliciousInput, artist: 'Malicious Artist' }) // Mock input data
      .expect(400)  // Expecting Bad Request or relevant error code
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  // Test for other SQL injection scenarios, such as update or delete routes
  it('should not allow SQL injection in song update (PUT /songs/:id)', function (done) {
    const maliciousInput = "1; DROP TABLE songs; --";

    request(app)
      .put(`/api/songs/${maliciousInput}`)
      .send({ title: 'Updated Title', artist: 'Updated Artist' })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

});
