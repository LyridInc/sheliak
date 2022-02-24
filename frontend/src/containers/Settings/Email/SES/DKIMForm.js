import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { renderTextField } from 'components/Input';

const DKIMForm = ({ register, errors }) => {
	return (
		<>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'dkimDomain', 'settings.form.field.dkim_domain')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'dkimKey', 'settings.form.field.dkim_key')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'dkimSelector', 'settings.form.field.dkim_selector')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'dkimHeaders', 'settings.form.field.dkim_headers')}
			</Grid>
		</>
	);
};

DKIMForm.propTypes = {
	register: PropTypes.func,
	errors: PropTypes.object,
};

export default DKIMForm;
