const express = require('express');
const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the backend!')
});

app.get('/api', async (req, res) => {

  res.send('Foobar!')
});

app.listen(DEFAULT_PORT, () => {
  console.log(`Listening on http://localhost:${DEFAULT_PORT}`);
});
