const express = require('express');
const queue = require('queue');
const url = require('url');
const fetch = require('node-fetch');

const app = express();
const q = queue({ results: [] });
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;

// TODO break out into configuration value.
const API_BASE = 'hapi.fhir.org';
const RECORD_COUNT = 100;
const PEDIATRIC_AGE = 18;
const FETCH_ALL_RECORDS = true;

app.get('/', (req, res) => {
  res.send('Welcome to the backend!')
});

const extractPatientData = ({
  id,
  name,
  birthDate,
  gender
}) => ({
  id,
  familyName: name?.[0]?.family,
  givenName: name?.[0]?.given?.join(' '),
  gender,
  birthDate,
  age: (new Date(new Date() - new Date(birthDate)).getFullYear() - 1970)
});

const aggregateData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = {
        pediatricTotal: 0,
        averageAge: 0,
        ageHistogram: {},
        entries: []
      };
      let sumAge = 0;
      let foundEntries = false;

      do {
        const pageOffset = result.entries.length;
        const requestUrl = url.parse(url.format({
          protocol: 'http',
          hostname: API_BASE,
          pathname: 'baseR4/Patient',
          query: {
            _getpagesoffset: pageOffset,
            _count: RECORD_COUNT,
          }
        }));
        console.log(`Requesting records: ${pageOffset} to ${pageOffset + RECORD_COUNT}`)
        const res = await fetch(`http://${requestUrl.hostname}/${requestUrl.path}`);
        const jsonResult = await res.json();

        foundEntries = jsonResult?.entry?.length;
        if (foundEntries) {
          // TODO this would be a good spot to refactor.
          jsonResult.entry.forEach(data => {
            const resource = data?.resource;
            const patient = extractPatientData(data?.resource);
            if (resource.resourceType === 'Patient' && patient.familyName) {
              sumAge += isNaN(patient.age) ? 0 : patient.age;
              result.pediatricTotal += patient.age > PEDIATRIC_AGE ? 0 : 1;
              result.ageHistogram[patient.age] =
                result.ageHistogram[patient.age] ?
                  result.ageHistogram[patient.age] + 1 : 1;

              result.entries.push(patient);
            } else {
              console.info(resource);
            }
          });
        }
      } while (foundEntries && FETCH_ALL_RECORDS);

      result.averageAge = sumAge / result.entries.length;

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

app.get('/api/patient_statistics', async (req, res) => {
  // TODO in a real application use a queue.
  // Then fetch the results later either with socket + polling
  // the queue.
  try {
    const result = await aggregateData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to aggregate: ' + err })
  }
});

app.listen(DEFAULT_PORT, () => {
  console.log(`Listening on http://localhost:${DEFAULT_PORT}`);
});
