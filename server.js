const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const FILE_PATH = path.join(__dirname, 'preview.html');

const server = http.createServer((req, res) => {
    fs.readFile(FILE_PATH, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading preview.html');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 SorobanFlow is running at http://localhost:${PORT}`);
    console.log(`(Using zero-dependency fallback server)`);
});
