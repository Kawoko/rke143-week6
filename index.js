const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let countriesData;
try {
  const data = fs.readFileSync('./countries.json', 'utf8');
  countriesData = JSON.parse(data);
} catch (err) {
  console.error('Failed to load countries.json:', err);
  countriesData = { countries: [] };
}

app.get('/', (req, res) => {
  res.json({ message: 'Countries API. Use /countries or /countries/:id' });
});

app.get('/countries', (req, res) => {
  res.json({ countries: countriesData.countries });
});

app.get('/countries/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const country = (countriesData.countries || []).find(c => c.id === id);
  if (!country) {
    return res.status(404).json({ error: 'Country not found' });
  }
  res.json(country);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
