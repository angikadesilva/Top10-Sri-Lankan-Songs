const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware to validate song data
function validateSongData(req, res, next) {
  const { title, artist, genre, release_year, youtube_views, decade } = req.body;

  console.log("Incoming song data:", req.body);  // Log the incoming data for debugging

  if (!title || !artist || !genre || !release_year || youtube_views === undefined || !decade) {
      return res.status(400).json({ error: "All fields are required" });
  }

  // Validate release_year (should be a valid year, integer)
  if (isNaN(release_year) || release_year < 1900 || release_year > new Date().getFullYear()) {
      return res.status(400).json({ error: "Invalid release year" });
  }

  // Validate youtube_views (should be a number)
  if (isNaN(youtube_views) || youtube_views < 0) {
      return res.status(400).json({ error: "Invalid youtube views" });
  }

  // Validate decade (should be a string like '2020s')
  const validDecades = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
  if (!validDecades.includes(decade)) {
      return res.status(400).json({ error: "Invalid decade. Valid options are: '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'." });
  }

  next();
}

// Get top 10 songs by YouTube views
router.get("/", (req, res) => {
    const limit = parseInt(req.query.limit) || 10;  // Default limit to 10
    const offset = parseInt(req.query.offset) || 0;  // Default offset to 0
    const query = "SELECT * FROM songs ORDER BY youtube_views DESC LIMIT ? OFFSET ?";
    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No songs found" });
        }
        res.json(results);
    });
});

// Get song details by ID
router.get("/:id", (req, res) => {
    const songId = req.params.id;

    // Validate that songId is an integer
    if (isNaN(songId)) {
        return res.status(400).json({ error: "Invalid song ID" });
    }

    const query = "SELECT * FROM songs WHERE id = ?";
    db.query(query, [songId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.json(results[0]);
    });
});

// Add a new song (POST)
router.post("/", validateSongData, (req, res) => {
    const { title, artist, genre, release_year, youtube_views, decade } = req.body;

    // Log the data about to be inserted into the database
    console.log("Inserting song into database:", { title, artist, genre, release_year, youtube_views, decade });

    const query = "INSERT INTO songs (title, artist, genre, release_year, youtube_views, decade) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [title, artist, genre, release_year, youtube_views, decade], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        res.status(201).json({
            id: results.insertId, // The `id` of the newly inserted song
            title,
            artist,
            genre,
            release_year,
            youtube_views,
            decade,
        });
    });
});

// Update a song (PUT)
router.put("/:id", validateSongData, (req, res) => {
    const songId = req.params.id;
    const { title, artist, genre, release_year, youtube_views, decade } = req.body;

    const query = "UPDATE songs SET title = ?, artist = ?, genre = ?, release_year = ?, youtube_views = ?, decade = ? WHERE id = ?";
    db.query(query, [title, artist, genre, release_year, youtube_views, decade, songId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.json({ message: "Song updated successfully" });
    });
});

// Delete a song (DELETE)
router.delete("/:id", (req, res) => {
    const songId = req.params.id;

    // Validate that songId is an integer
    if (isNaN(songId)) {
        return res.status(400).json({ error: "Invalid song ID" });
    }

    const query = "DELETE FROM songs WHERE id = ?";
    db.query(query, [songId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.json({ message: "Song deleted successfully" });
    });
});

module.exports = router;
