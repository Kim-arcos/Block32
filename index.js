const express = require('express');
const app = express();
const port = 3000;



CREATE TABLE flavors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  INSERT INTO flavors (name, is_favorite) VALUES ('Chocolate', true);
  INSERT INTO flavors (name, is_favorite) VALUES ('Vanilla', false);
  INSERT INTO flavors (name, is_favorite) VALUES ('Strawberry', true);

app.get('/api/flavors', (req, res) => {
    res.send('Get all flavors');
});

app.get('/api/flavors/:id', (req, res) => {
    const flavorId = req.params.id;
    res.send(`Get flavor with ID ${flavorId}`);
});

app.post('/api/flavors', (req, res) => {
    res.send('Create a new flavor');
});

app.delete('/api/flavors/:id', (req, res) => {
    const flavorId = req.params.id;
    res.send(`Delete flavor with ID ${flavorId}`);
});

app.put('/api/flavors/:id', (req, res) => {
    const flavorId = req.params.id;
    res.send(`Update flavor with ID ${flavorId}`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });