window.onload = fetchTopSongs;

function fetchTopSongs() {
    fetch('http://localhost:5000/api/songs')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#songsTable tbody");
            tableBody.innerHTML = '';

            data.forEach((song, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${song.title}</td>
                    <td>${song.artist}</td>
                    <td>${song.youtube_views.toLocaleString()}</td>
                    <td><button onclick="fetchSongDetails(${song.id})">View Details</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching top songs:", error));
}

function fetchSongDetails(id) {
    fetch(`http://localhost:5000/api/songs/${id}`)
        .then(response => response.json())
        .then(song => {
            const detailsDiv = document.getElementById("songDetails");
            detailsDiv.innerHTML = `
                <h2>Song Details</h2>
                <p><strong>Title:</strong> ${song.title}</p>
                <p><strong>Artist:</strong> ${song.artist}</p>
                <p><strong>YouTube Views:</strong> ${song.youtube_views.toLocaleString()}</p>
            `;
        })
        .catch(error => console.error("Error fetching song details:", error));
}
