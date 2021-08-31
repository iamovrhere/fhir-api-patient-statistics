# FHIR API - Patient Statistics

## Background

This is a 1 hour take home assignment.

## Application Requirements


1. Create a simple web application (you can use whatever boilerplate you think best)
1. Go to the sandbox site: http://hapi.fhir.org/, this is a test server from UHN to test out FHIR API calls (https://en.wikipedia.org/wiki/Fast_Healthcare_Interoperability_Resources ) – the latest interoperability standard to exchange health information. Note: we don’t own this server but regularly use it to do FHIR testing. We regularly use FHIR calls to integrate with hospital electronic health records (e.g. get patient data). Please note we don’t own this sandbox, the data is public, and also that other people will be interacting with it as well (e.g. other users might send test data in so your queries might not always return the same thing).
1. In your web application, build out methods to fetch a sample of patients from the FHIR server (https://hapi.fhir.org/resource?serverId=home_r4&pretty=false&_summary=&resource=Patient ). There should be documentation on how to properly construct the query.
1. Once you are able to fetch the patient data, examine the JSON returned to get familiar with the schema.
1. Create views (Html) that will show basic statistics from the data you retrieved including:
    - Number of patients
    - Average age
    - Number of pediatric patients (less than 18)
1. Create a simple visualization to graph the age of patients as a histogram.  You can use any library you are familiar with (e.g. google charts, chartjs).
1. Create a simple table to lists out all patients in your dataset (columns can be name, birthdate, and any other relevant information you feel appropriate). Include a simple filter for this table to show only pediatric cases (patients less than age 18).
1. Extra: some considerations for you to make include what happens if the dataset is over 100,000+ patients – how do you manage load performance. How about if we needed to store the data but also secure/encrypt it? (You don’t need to code these, but be prepared to discuss strategies).

## Design

The plan is to have a node backend + separate React frontend.

### Requirements

* **Recommended:** Node 14 (via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
* yarn - [Install yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)

### Setup

Backend:
  - `yarn install` + `yarn start`
Frontend:
  - `yarn install` + `yarn start`


###  Error: `System limit for number of file watchers reached`

```bash
Internal watch failed: ENOSPC: System limit for number of file Error: ENOSPC: System limit for number of file watchers reached, watch '/path/path/path/repos/fhir-api-patient-statistics/public'
...
errno: -28,
syscall: 'watch',
code: 'ENOSPC',
path: '/path/path/path/repos/fhir-api-patient-statistics/public',
filename: '/path/path/path/repos/fhir-api-patient-statistics/public'
}
```

Sometimes happens on linux (in general) for Node scripts of this nature, Either:

```bash
sudo sysctl -w fs.inotify.max_user_watches=100000
```

Or edit `/etc/sysctl.d/10-user-watches.conf` with:
```ini
fs.inotify.max_user_watches = 100000
```
