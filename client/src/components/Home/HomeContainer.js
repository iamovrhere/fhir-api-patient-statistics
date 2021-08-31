import React from 'react';
import { HomeComponent } from './HomeComponent';

export const HomeContainer = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const API_BASE = window.__FHIR_API_PATIENT_STATISTICS_SETTINGS__.API_BASE;
    const PATIENT_PATH = window.__FHIR_API_PATIENT_STATISTICS_SETTINGS__.PATIENT_PATH;
    if (!data && !error) {
      fetch(`${API_BASE}${PATIENT_PATH}`)
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => setError(error.toString()));
    }
  }, [data, error])
  return <HomeComponent data={data} error={error} />;
};
