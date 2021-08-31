import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '../Table';

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
        <li>Average Age: {data.averageAge.toFixed(2)}</li>
        <li>Pediatric Patients: {data.entries.length}</li>
      </ul>
      <Table rows={data.entries} />
    </div >
    :
    <CircularProgress />;
};
