import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Grid, Typography } from '@mui/material';
import { renderTextField, renderSwitch } from 'components/Input';

const SMTPForm = ({ errors, control }) => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography component="div" variant="h6" mt={4}>
					SMTP Related Settings
				</Typography>
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'host', 'settings.form.field.host', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'port', 'settings.form.field.port', {
					type: 'number',
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'username', 'settings.form.field.username', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'password', 'settings.form.field.password', {
					type: 'password',
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'timeout', 'settings.form.field.timeout')}
			</Grid>
			<Grid item xs={12} sm={2}>
				{renderSwitch(control, 'useTls', 'settings.form.field.use_tls')}
			</Grid>
			<Grid item xs={12} sm={2}>
				{renderSwitch(control, 'useSsl', 'settings.form.field.use_ssl')}
			</Grid>
		</Grid>
	);
};

SMTPForm.propTypes = {
	errors: PropTypes.object,
	control: PropTypes.object,
};

export default injectIntl(SMTPForm);
