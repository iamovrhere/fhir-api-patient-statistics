## Setup

1. Install packages: `yarn install`
1. Run: `yarn start`
    - Debug: `yarn debug`

## Endpoints

`/api/patient_statistics` - Returns a page of 250 records
    ```json
    {
      "pediatricTotal":0,
      "averageAge":25,
      "ageHistogram":{
        "25": 1,
        ...
      },
      "entries":[
        {
          id":"555555"
          "familyName":"Foobar",
          "givenName":"Bob Joe",
          "gender":"male",
          "birthDate":"1996-02-07",
          "age":25,
          "isPediatric":false
          }
        }
        ...
      ]}
    ```
`/api/patient_statistics/all` - Continually loops pages of 100 records until it finds all records.
    ```json
    {
      "pediatricTotal":0,
      "averageAge":25,
      "ageHistogram":{
        "25": 1,
        ...
      },
      "entries":[
        {
          id":"555555"
          "familyName":"Foobar",
          "givenName":"Bob Joe",
          "gender":"male",
          "birthDate":"1996-02-07",
          "age":25,
          "isPediatric":false
          }
        }
        ...
      ]}
    ```

These are both synchronous requests.

### Future considerations

When dealing with lots of records it'd be ideal to use an asynchronous setup.

In this your request queues the job, the backend does the fetching + processing, then the values may be returned by:
- Polling (naive)
- Sockets (send message when complete)
- Follow up report (e.g. email when done, load report which was saved somewhere)

### Notes

curl "http://hapi.fhir.org/baseR4/Patient?_pretty=true&_getpagesoffset=0&_count=1000" > sample.json
