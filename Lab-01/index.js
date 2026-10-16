const express = require('express');

const app = express();

app.get('/', (request, response) => {
    response.send('Welcome to Lab 1 - Node.js and Express Server');
});

app.get('/about', (request, response) => {
    response.send(`Name: N. Maruthi Prasanna Kumar Reddy ;\n
         Redg No : 252U1R9105 ;\n
         Subject : Backend Development Fundamentals;\n
         SECTION : GEN-AI 2B [111]
         `);
});

app.get('/time', (request, response) => {
     let date = new Date();
  response.send(`Today's date is ${date}`);
});

app.use((request, response) => {
    response.status(404).send("404 Page Not Found");
});

app.listen(3000);

console.log('Server running at http://localhost:3000/');