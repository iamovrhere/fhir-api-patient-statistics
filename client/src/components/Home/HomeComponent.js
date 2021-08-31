import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '../Table';
import Chart from '../Chart'

export const HomeComponent = ({ data, error }) => {
  if (error) {
    return (
      <div>
        <h1>Errors</h1>
        <div>Something is wrong! {error}</div>
      </div>
    );
  }
  return data ?
    <div>
      <h1>Summary</h1>
      <ul>
        <li>Patients: {data.entries.length}</li>
        <li>Average Age: {data.averageAge && data.averageAge.toFixed(2)}</li>
        <li>Pediatric Patients: {data.pediatricTotal}</li>
      </ul>
      <Chart histogramData={data.ageHistogram} />
      <Table rows={data.entries} />
    </div >
    :
    <CircularProgress />;
};
