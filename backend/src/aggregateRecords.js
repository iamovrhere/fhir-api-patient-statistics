const config = require('./config.json');
const url = require('url');
const fetch = require('node-fetch');

/**
 * @typedef {{
 * id: string,
 * familyName: string|undefined,
 * givenName: string|undefined,
 * gender: string|undefined,
 * age: number|undefined,
 * isPediatric: boolean
 * }} Patient
 */
/**
 * Extract single patient record, calculating age + if isPediatric.
 *
 * @param {{
 * id: string,
 * name: [{family: string, given: [string]}]|undefined,
 * birthDate: string|undefined,
 * gender: string|undefined
 * }} param0
 * @return {Patient}
 */
const extractPatientData = ({
  id,
  name,
  birthDate,
  gender
}) => {
  const age = (new Date(new Date() - new Date(birthDate)).getFullYear() - 1970);
  return {
    id,
    familyName: name?.[0]?.family,
    givenName: name?.[0]?.given?.join(' '),
    gender,
    birthDate,
    age,
    isPediatric: age < config.PEDIATRIC_AGE
  };
};

/**
 *
 * @param {{resourceType: string}} resource
 * @param {Patient} patient
 * @return {boolean}
 */
const isValidPatient = (resource, patient) => {
  return resource.resourceType === 'Patient' && patient.familyName;
};

/**
 * @typedef {{
 *  pediatricTotal: number,
 *  averageAge: number,
 *  ageHistogram: { number: number },
 *  entries: [Patient]
 * }} AggregateResult
 */

/**
 *
 * @param {AggregateResult} result
 * @param {number} sumAge
 * @param {Patient} patient
 * @returns {{result: AggregateResult, sumAge: number}}
 */
const addToResult = (result, sumAge, patient) => {
  let newResult = {
    pediatricTotal: result.pediatricTotal ?? 0,
    averageAge: result.averageAge ?? 0,
    ageHistogram: result.ageHistogram ? { ...result.ageHistogram } : {},
    entries: result.entries ? [...result.entries] : []
  };
  if (patient) {
    sumAge += isNaN(patient.age) ? 0 : patient.age;
    newResult.pediatricTotal += patient.isPediatric ? 1 : 0;
    newResult.ageHistogram[patient.age] =
      newResult.ageHistogram[patient.age] ?
        newResult.ageHistogram[patient.age] + 1 : 1;
    newResult.entries.push(patient);
  }
  return { result: newResult, sumAge };
};

const aggregateData = async (fetchAllRecords) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { result, sumAge } = addToResult({}, 0)
      let foundEntries = false;

      do {
        const pageOffset = result.entries.length;
        const requestUrl = url.parse(url.format({
          protocol: 'http',
          hostname: config.API_BASE,
          pathname: 'baseR4/Patient',
          query: {
            _getpagesoffset: pageOffset,
            _count: config.RECORD_COUNT,
          }
        }));
        console.log(`Requesting records: ${pageOffset} to ${pageOffset + config.RECORD_COUNT}`)
        const res = await fetch(`http://${requestUrl.hostname}/${requestUrl.path}`);
        const jsonResult = await res.json();

        foundEntries = jsonResult?.entry?.length;
        if (foundEntries) {
          jsonResult.entry.forEach(data => {
            const resource = data?.resource;
            const patient = extractPatientData(data?.resource);
            if (isValidPatient(resource, patient)) {
              const values = addToResult(result, sumAge, patient);
              result = values.result;
              sumAge = values.sumAge;
            } else {
              //console.log(resource, patient);
            }
          });
        }
      } while (foundEntries && fetchAllRecords);

      result.averageAge = sumAge / result.entries.length;

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  aggregateData
};
