import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const UNDEFINED = 'N/A?';
const PEDIATRIC_LABEL = 'Show Pediatric Only'

export default function BasicTable({ rows }) {
  const classes = useStyles();
  const [pediatricOnly, setPediatricOnly] = React.useState(false);

  return (
    <TableContainer component={Paper}>
      <FormControlLabel
        control={<Checkbox
          checked={pediatricOnly}
          onChange={() => setPediatricOnly(!pediatricOnly)}
          name={PEDIATRIC_LABEL}
        />}
        label={PEDIATRIC_LABEL}
      />
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Family Name</TableCell>
            <TableCell>Given Name(s)</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell align="right">Birth Date</TableCell>
            <TableCell align="right">Age</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .filter(patient => pediatricOnly ? patient.isPediatric : true)
            .map((patient) => (
              <TableRow key={patient.id + patient.familyName + patient.givenName + patient.birthDate}>
                <TableCell component="th" scope="row">
                  {patient.familyName ?? UNDEFINED}
                </TableCell>
                <TableCell >{patient.givenName ?? UNDEFINED}</TableCell>
                <TableCell >{patient.gender ?? UNDEFINED}</TableCell>
                <TableCell align="right">{patient.birthDate ?? UNDEFINED}</TableCell>
                <TableCell align="right">{patient.age ?? UNDEFINED}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
