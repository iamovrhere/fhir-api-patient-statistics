const express = require('express');
const queue = require('queue');
const config = require('./config.json');

const { aggregateData } = require('./aggregateRecords')

const app = express();
const q = queue({ results: [] });
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || config.PORT;

app.get('/', (req, res) => {
  res.send('Welcome to the backend! Check the README')
});

app.get('/api/patient_statistics/all', async (req, res) => {
  // TODO in a real application use a queue.
  // Then fetch the results later either with socket + polling
  // the queue.
  try {
    const result = await aggregateData(true);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to aggregate: ' + err })
  }
});

app.get('/api/patient_statistics', async (req, res) => {
  // TODO in a real application use a queue.
  // Then fetch the results later either with socket + polling
  // the queue.
  try {
    const result = await aggregateData(false);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to aggregate: ' + err })
  }
});

app.listen(DEFAULT_PORT, () => {
  console.log(`Listening on http://localhost:${DEFAULT_PORT}`);
});
