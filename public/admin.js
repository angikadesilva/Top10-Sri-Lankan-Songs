document.getElementById('addSongForm').addEventListener('submit', addSong);
document.getElementById('updateSongForm').addEventListener('submit', updateSong);
document.getElementById('deleteSongForm').addEventListener('submit', deleteSong);

function addSong(event) {
    event.preventDefault();

    const song = {
        title: document.getElementById('title').value,
        artist: document.getElementById('artist').value,
        genre: document.getElementById('genre').value,
        release_year: parseInt(document.getElementById('releaseYear').value),
        youtube_views: parseInt(document.getElementById('youtubeViews').value),
        decade: document.getElementById('decade').value
    };

    fetch('http://localhost:5000/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
    })
    .then(response => response.json())
    .then(data => showMessage(data.message))
    .catch(error => showMessage("Error adding song"));
}

function updateSong(event) {
    event.preventDefault();

    const songId = document.getElementById('updateId').value;
    const song = {
        title: document.getElementById('updateTitle').value,
        artist: document.getElementById('updateArtist').value,
        genre: document.getElementById('updateGenre').value,
        release_year: parseInt(document.getElementById('updateReleaseYear').value),
        youtube_views: parseInt(document.getElementById('updateYoutubeViews').value),
        decade: document.getElementById('updateDecade').value
    };

    fetch(`http://localhost:5000/api/songs/${songId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
    })
    .then(response => response.json())
    .then(data => showMessage(data.message))
    .catch(error => showMessage("Error updating song"));
}

function deleteSong(event) {
    event.preventDefault();

    const songId = document.getElementById('deleteId').value;

    fetch(`http://localhost:5000/api/songs/${songId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => showMessage(data.message))
    .catch(error => showMessage("Error deleting song"));
}

function showMessage(message) {
    document.getElementById('message').innerText = message;
}
