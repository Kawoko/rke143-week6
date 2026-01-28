const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

let countriesData;
try {
  const data = fs.readFileSync('./countries.json', 'utf8');
  countriesData = JSON.parse(data);
} catch (err) {
  console.error('Failed to load countries.json:', err);
  countriesData = { countries: [] };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Countries API. Use /countries or /countries/:id' }));
  } else if (pathname === '/countries') {
    res.writeHead(200);
    res.end(JSON.stringify({ countries: countriesData.countries }));
  } else if (pathname.startsWith('/countries/')) {
    const id = Number(pathname.split('/')[2]);
    if (!Number.isInteger(id) || id < 1) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid id' }));
      return;
    }
    const country = (countriesData.countries || []).find(cty => cty.id === id);
    if (!country) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Country not found' }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify(country));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
