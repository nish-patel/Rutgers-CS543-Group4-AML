const express = require('express');
const neo4j = require('neo4j-driver');

const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());
const port = 3000;

// Neo4j connection setup
const uri = "bolt://localhost:7687"; // Adjust as per your Neo4j instance
const user = "neo4j";                // Your Neo4j username
const password = "password";         // Your Neo4j password

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for executing Cypher query and rendering the result in the browser
app.get('/executeCypherQuery', async (req, res) => {
    const cypherQuery = `
        MATCH path = (root)-[*1..2]-(connected)
        WHERE root.accountID IN ['efeb5a6214865c59c9d769d5b37107fcfc9a473536519f31efa2486bc471fa49'] AND root <> connected
        RETURN DISTINCT root, connected, relationships(path) AS rels;
    `;

    try {
        const result = await session.run(cypherQuery);
        const records = result.records.map(record => record.toObject());

        // Render the result in an HTML page
        res.send(renderResult(records));
    } catch (error) {
        console.error('Error executing Cypher query:', error);
        res.status(500).send('Error executing Cypher query');
    }
});

// Helper function to render the result in an HTML page
function renderResult(records) {
    // You can customize the HTML rendering based on your needs
    let html = '<html><head><title>Neo4j Query Result</title></head><body>';
    html += '<h1>Neo4j Query Result</h1>';
    
    records.forEach((record, index) => {
        html += `<h2>Record ${index + 1}</h2>`;
        html += '<pre>' + JSON.stringify(record, null, 2) + '</pre>';
    });

    html += '</body></html>';
    return html;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
