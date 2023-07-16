import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { renderTextField } from 'components/Input';

const DKIMForm = ({ control, errors }) => {
	return (
		<>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'dkimDomain', 'settings.form.field.dkim_domain')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'dkimKey', 'settings.form.field.dkim_key')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'dkimSelector', 'settings.form.field.dkim_selector')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'dkimHeaders', 'settings.form.field.dkim_headers')}
			</Grid>
		</>
	);
};

DKIMForm.propTypes = {
	control: PropTypes.object,
	errors: PropTypes.object,
};

export default DKIMForm;
