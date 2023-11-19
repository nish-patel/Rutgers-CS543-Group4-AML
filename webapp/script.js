document.getElementById('exploreButton').addEventListener('click', function() {
    document.getElementById('additionalContent').style.display = 'block';
    this.style.display = 'none';
});


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchDataset').addEventListener('click', function() {
        // Send a request to the server to execute the Cypher query
        fetch('http://localhost:3000/executeCypherQuery')
            .then(response => response.text())
            .then(html => {
                // Open the result in a new browser tab or window
                const newWindow = window.open();
                newWindow.document.open();
                newWindow.document.write(html);
                newWindow.document.close();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});




