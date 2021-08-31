import React from 'react';
import { HomeComponent } from './HomeComponent';

// TODO refactor out to configuration values.
const API_BASE = 'http://localhost:8080';
const API_PATH = '/api/patient_statistics';

export const HomeContainer = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!data && !error) {
      fetch(`${API_BASE}${API_PATH}`)
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => setError(error.toString()));
    }
  }, [data, error])
  return <HomeComponent data={data} error={error} />;
};
