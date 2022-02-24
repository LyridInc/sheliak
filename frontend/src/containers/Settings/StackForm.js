import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { injectIntl } from 'react-intl';
import useSettingsStyles from 'assets/styles/Containers/Settings';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';
import { useLazyQuery, useMutation } from '@apollo/client';
import { StackMutation } from 'graphql/mutations';
import { StackQuery } from 'graphql/queries';
import SESForm from './Email/SESForm';
import SMTPForm from './Email/SMTPForm';
import { renderTextField, renderSwitch } from 'components/Input';
import { useToasts } from 'react-toast-notifications';
import { errorHandler } from 'store/Links/errorLink';

const StackForm = ({ intl }) => {
	const { addToast } = useToasts();
	const classes = useSettingsStyles();
	const [mode, setMode] = React.useState('Create');
	const [stack, setStack] = React.useState(null);
	const [selectedBackend, setSelectedBackend] = React.useState('SES');

	const coreSchema = {
		backend: yup.string().required(intl.formatMessage({ id: 'settings.form.field.backend.required' })),
		fromEmail: yup.string(),
		failSilently: yup.boolean().default(false),
		siteTitle: yup.string(),
	};

	const sesSchema = {
		awsAccessKeyId: yup.string(),
		awsSecretAccessKey: yup.string(),
		awsSesRegionEndpoint: yup.string(),
		awsSesRegionName: yup.string(),
		awsSesAutoThrottle: yup
			.number()
			.test('is-decimal', 'invalid decimal', (value) => (value + '').match(/^\d*\.{1}\d*$/))
			.nullable(true),
		awsSesConfig: yup.string(),
		dkimDomain: yup.string(),
		dkimKey: yup.string(),
		dkimSelector: yup.string(),
		dkimHeaders: yup.string(),
		awsSesSourceArn: yup.string(),
		awsSesFromArn: yup.string(),
		awsSesReturnPathArn: yup.string(),
		useTls: yup.boolean().default(false),
		useSsl: yup.boolean().default(false),
	};

	const smtpSchema = {
		host: yup.string(),
		port: yup
			.number()
			.nullable(true)
			.transform((_, val) => (val === Number(val) ? val : null)),
		username: yup.string(),
		password: yup.string(),
		useTls: yup.boolean().default(false),
		useSsl: yup.boolean().default(false),
		timeout: yup
			.number()
			.nullable(true)
			.transform((_, val) => (val === Number(val) ? val : null)),
	};

	const schemaOptions = {
		ses: sesSchema,
		smtp: smtpSchema,
	};

	const schema = yup.object().shape({
		...coreSchema,
		...schemaOptions[selectedBackend.toLowerCase()],
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
		setValue,
		control,
	} = useForm({
		mode: 'all',
		resolver: yupResolver(schema),
	});

	const { ref: backendRef, ...backendInputProps } = register('backend');

	const handleBackendChange = (event) => {
		setSelectedBackend(event.target.value);
	};

	const [createStack, { loading: createLoading }] = useMutation(StackMutation.CREATE_STACK, {
		onCompleted: (data) => {
			if (data && data.createStack) {
				const response = data.createStack;
				let errors = [{ message: intl.formatMessage({ id: 'settings.create.response.error' }) }];
				if (response.success) {
					addToast(intl.formatMessage({ id: 'settings.create.response.success' }), { appearance: 'success' });
				} else {
					if (response.errors && response.errors.length > 0) {
						errorHandler(response.errors[0]);
					} else {
						errorHandler(errors[0]);
					}
				}
			} else {
				errorHandler(errors[0]);
			}
		},
	});

	const [updateStack, { loading: updateLoading }] = useMutation(StackMutation.PATCH_STACK, {
		onCompleted: (data) => {
			if (data && data.patchStack) {
				const response = data.patchStack;
				let errors = [{ message: intl.formatMessage({ id: 'settings.update.response.error' }) }];
				if (response.success) {
					addToast(intl.formatMessage({ id: 'settings.update.response.success' }), { appearance: 'success' });
				} else {
					if (response.errors && response.errors.length > 0) {
						errorHandler(response.errors[0]);
					} else {
						errorHandler(errors[0]);
					}
				}
			} else {
				errorHandler(errors[0]);
			}
		},
	});

	const [getStacks, { loading }] = useLazyQuery(StackQuery.GET_STACKS, {
		onCompleted: (data) => {
			if (data?.stacks?.edges?.length > 0) {
				const stack = data.stacks.edges[0].node;
				const conf = stack.email;
				setStack(stack);
				setSelectedBackend(conf.backend);

				setValue('backend', conf.backend, { shouldValidate: true });
				setValue('siteTitle', stack.siteTitle, { shouldValidate: true });
				setValue('fromEmail', conf.fromEmail, { shouldValidate: true });
				setValue('failSilently', conf.failSilently, { shouldValidate: true });

				switch (conf.backend) {
					case 'SMTP':
						setValue('host', conf.host, { shouldValidate: true });
						setValue('port', conf.port, { shouldValidate: true });
						setValue('username', conf.username, { shouldValidate: true });
						setValue('password', conf.password, { shouldValidate: true });
						setValue('useTls', conf.useTls, { shouldValidate: true });
						setValue('useSsl', conf.useSsl, { shouldValidate: true });
						setValue('timeout', conf.timeout, { shouldValidate: true });
						break;

					case 'SES':
						setValue('awsAccessKeyId', conf.awsAccessKeyId, { shouldValidate: true });
						setValue('awsSecretAccessKey', conf.awsSecretAccessKey, { shouldValidate: true });
						setValue('awsSesRegionEndpoint', conf.awsSesRegionEndpoint, { shouldValidate: true });
						setValue('awsSesRegionName', conf.awsSesRegionName, { shouldValidate: true });
						setValue('awsSesAutoThrottle', conf.awsSesAutoThrottle, { shouldValidate: true });
						setValue('awsSesConfig', conf.awsSesConfig, { shouldValidate: true });
						setValue('dkimDomain', conf.dkimDomain, { shouldValidate: true });
						setValue('dkimKey', conf.dkimKey, { shouldValidate: true });
						setValue('dkimSelector', conf.dkimSelector, { shouldValidate: true });
						setValue('dkimHeaders', conf.dkimHeaders, { shouldValidate: true });
						setValue('awsSesSourceArn', conf.awsSesSourceArn, { shouldValidate: true });
						setValue('awsSesFromArn', conf.awsSesFromArn, { shouldValidate: true });
						setValue('awsSesReturnPathArn', conf.awsSesReturnPathArn, { shouldValidate: true });
						break;
				}
				setMode('Update');
			}
		},
	});

	const onSubmit = (data) => {
		const finalizedData = finalizeFields(data);

		switch (mode) {
			case 'Create':
				createStack({
					variables: finalizedData,
				});
				break;

			case 'Update':
				updateStack({
					variables: {
						...finalizedData,
						id: stack.id,
					},
				});
				break;
		}
	};

	const finalizeFields = (data) => {
		let finalizedData = {};
		const coreKeys = Object.keys(coreSchema);
		const smtpKeys = Object.keys(smtpSchema);
		const sesKeys = Object.keys(sesSchema);

		coreKeys.forEach((key) => (finalizedData[key] = data[key]));
		sesKeys.forEach((key) => {
			if (key == 'awsSesAutoThrottle') {
				return (finalizedData[key] = '0');
			}
			return (finalizedData[key] = '');
		});
		smtpKeys.forEach((key) => {
			if (key == 'timeout' || key == 'port') {
				return (finalizedData[key] = 0);
			} else if (key == 'useTls' || key == 'useSsl') {
				return (finalizedData[key] = false);
			}
			return (finalizedData[key] = '');
		});

		switch (selectedBackend) {
			case 'SMTP': {
				smtpKeys.forEach((key) => (finalizedData[key] = data[key]));
				break;
			}

			case 'SES': {
				sesKeys.forEach((key) => (finalizedData[key] = data[key]));
				break;
			}
		}

		return finalizedData;
	};

	React.useEffect(() => {
		getStacks({
			variables: {
				first: 10,
				offset: 0,
			},
		});
	}, [getStacks]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography component="div" variant="h6">
						{intl.formatMessage({ id: `settings.form.header` })}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl variant="standard" fullWidth>
						<InputLabel id="backend" shrink={true}>
							{intl.formatMessage({ id: `settings.form.field.backend.label` })}
						</InputLabel>
						<Select
							{...backendInputProps}
							ref={backendRef}
							labelId="backend"
							value={selectedBackend}
							onChange={handleBackendChange}
							label="Backend">
							<MenuItem value="SMTP">SMTP</MenuItem>
							<MenuItem value="SES">SES</MenuItem>
							<MenuItem value="CONSOLE">Console</MenuItem>
							<MenuItem value="IN_MEMORY">In Memory</MenuItem>
							<MenuItem value="DUMMY">Dummy</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					{renderTextField(register, errors, 'siteTitle', 'settings.form.field.site_title')}
				</Grid>
				<Grid item xs={12} sm={6}>
					{renderTextField(register, errors, 'fromEmail', 'settings.form.field.from_email')}
				</Grid>
				<Grid item xs={12} sm={6}>
					{renderSwitch(register, control, 'failSilently', 'settings.form.field.fail_silently')}
				</Grid>
			</Grid>
			{selectedBackend === 'SES' && <SESForm register={register} errors={errors} />}
			{selectedBackend === 'SMTP' && <SMTPForm register={register} errors={errors} control={control} />}

			<Box className={classes.actions}>
				<ButtonLoader
					variant="contained"
					tooltip={intl.formatMessage({ id: `settings.form.button.stack.${mode.toLowerCase()}.tooltip` })}
					loader={createLoading || updateLoading || loading}
					type="submit"
					fullWidth
					disabled={!isValid || isSubmitting}>
					{mode} Stack
				</ButtonLoader>
			</Box>
		</form>
	);
};

StackForm.propTypes = {
	intl: PropTypes.object.isRequired,
};

export default injectIntl(StackForm);
