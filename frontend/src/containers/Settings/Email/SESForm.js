import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import DKIMForm from './SES/DKIMForm';
import { renderTextField } from 'components/Input';

const SESForm = ({ control, errors }) => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography component="div" variant="h6" mt={4}>
					SES Related Settings
				</Typography>
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsAccessKeyId', 'settings.form.field.aws_access_key_id', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSecretAccessKey', 'settings.form.field.aws_secret_access_key', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSesRegionEndpoint', 'settings.form.field.aws_ses_region_endpoint', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSesRegionName', 'settings.form.field.aws_ses_region_name', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSesAutoThrottle', 'settings.form.field.aws_ses_auto_throttle')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSesConfig', 'settings.form.field.aws_ses_config')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSesSourceArn', 'settings.form.field.aws_ses_source_arn')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSesFromArn', 'settings.form.field.aws_ses_from_arn')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(control, errors, 'awsSesReturnPathArn', 'settings.form.field.aws_ses_return_path_arn')}
			</Grid>
			<DKIMForm control={control} errors={errors} />
		</Grid>
	);
};

SESForm.propTypes = {
	control: PropTypes.object,
	errors: PropTypes.object,
};

export default SESForm;
