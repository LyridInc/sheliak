import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import DKIMForm from './SES/DKIMForm';
import { renderTextField } from 'components/Input';

const SESForm = ({ register, errors }) => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography component="div" variant="h6" mt={4}>
					SES Related Settings
				</Typography>
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsAccessKeyId', 'settings.form.field.aws_access_key_id', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSecretAccessKey', 'settings.form.field.aws_secret_access_key', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSesRegionEndpoint', 'settings.form.field.aws_ses_region_endpoint', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSesRegionName', 'settings.form.field.aws_ses_region_name', {
					required: true,
				})}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSesAutoThrottle', 'settings.form.field.aws_ses_auto_throttle')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSesConfig', 'settings.form.field.aws_ses_config')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSesSourceArn', 'settings.form.field.aws_ses_source_arn')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSesFromArn', 'settings.form.field.aws_ses_from_arn')}
			</Grid>
			<Grid item xs={12} sm={6}>
				{renderTextField(register, errors, 'awsSesReturnPathArn', 'settings.form.field.aws_ses_return_path_arn')}
			</Grid>
			<DKIMForm register={register} errors={errors} />
		</Grid>
	);
};

SESForm.propTypes = {
	register: PropTypes.func,
	errors: PropTypes.object,
};

export default SESForm;
