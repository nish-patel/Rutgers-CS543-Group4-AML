const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Define the path to the HTML file
    const filePath = path.join(__dirname, 'search.html');

    // Read the HTML file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // If there's an error (e.g., file not found), send a 404 response
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            // Set the content type to HTML and send the file's content
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

const port = 3000; // You can change the port number if needed

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
