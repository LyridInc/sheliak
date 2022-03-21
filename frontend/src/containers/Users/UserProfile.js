import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Tabs, Tab, TextField, Backdrop, CircularProgress, Grid, Paper, Button } from '@mui/material';
import UserManagePassword from './UserPassword/UserManagePassword';
import UserResetPassword from './UserPassword/UserResetPassword';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';
import TabPanel from 'components/TabPanel';
import useUsersStyles from 'assets/styles/Containers/Users';
import { injectIntl } from 'react-intl';
import { useLazyQuery } from '@apollo/client';
import { UsersQuery } from 'graphql/queries';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/lab';
import { renderTextField, renderSwitch, renderAutoComplete } from 'components/Input';

const UserProfile = ({ intl }) => {
	const { id } = useParams();
	const history = useHistory();
	const classes = useUsersStyles();
	const [selectedTab, setSelectedTab] = React.useState(0);
	const [user, setUser] = React.useState({});
	const [date, setDate] = React.useState(null);

	const personalInformationSchema = yup.object().shape({
		email: yup.string().required('Email field is required').email('Email must be a valid email address'),
		firstName: yup.string().required('Enter your first name'),
		middleName: yup.string(),
		lastName: yup.string().required('Enter your last name'),
		inviteCode: yup.string(),
		companyName: yup.string().required('Enter your company name'),
		nationality: yup.string().required('Enter your nationality'),
		address: yup.string().required('Enter your address'),
		mobileNumber: yup.string().required('Enter your mobile number'),
	});

	const {
		register: personalInformationRegister,
		handleSubmit: personalInformationSubmitHandler,
		formState: {
			errors: personalInformationErrors,
			isValid: isPersonalInformationValid,
			isSubmitting: isPersonalInformationSubmitting,
		},
		setValue: setPersonalInformationValue,
		control,
	} = useForm({
		mode: 'all',
		resolver: yupResolver(personalInformationSchema),
	});

	const { ref: dateOfBirthRef, ...dateOfBirthInputProps } = personalInformationRegister('dateOfBirth');

	const onPersonalInformationSubmmit = () => {
		// const variables = {
		// 	email: data.email,
		// 	firstName: data.firstName,
		// 	middleName: data.middleName,
		// 	lastName: data.lastName,
		// 	inviteCode: data.inviteCode,
		// 	companyName: data.companyName,
		// 	nationality: data.nationality,
		// 	address: data.address,
		// 	mobileNumber: data.mobileNumber,
		// 	timezone: data.timezone,
		// 	gender: data.gender,
		// };
		// do some graphql mutations here
		//   login({
		//     variables: variables,
		//   });
	};

	const [getUser, { loading: getUserLoading }] = useLazyQuery(UsersQuery.GET_USER, {
		onCompleted: (data) => {
			if (data.user) {
				setUser(data.user);

				const keys = Object.keys(data.user);
				keys.forEach((key) => {
					if (key == 'profile') {
						const profile = data.user['profile'];
						const profileKeys = Object.keys(profile);
						profileKeys.forEach((profileKey) => {
							setPersonalInformationValue(profileKey, profile[profileKey]);
						});
					} else {
						setPersonalInformationValue(key, data.user[key]);
					}
				});
			}
		},
	});

	const updatePersonalInformationLoading = false; // TBA

	React.useEffect(() => {
		getUser({
			variables: {
				id,
			},
		});
	}, [getUser, id]);

	const nationality = [{ label: 'Indonesia' }, { label: 'USA' }, { label: 'India' }, { label: 'Russia' }];

	const timezone = [
		{ label: 'UTC +7 (Waktu Indonesia Barat)', value: 'UTC+7' },
		{ label: 'UTC -8 (Pacific Standard Time)', value: 'UTC-8' },
		{ label: 'UTC +5:30 (Indian Standard Time)', value: 'UTC+5' },
		{ label: 'UTC +10 (Vladivostok Time)', value: 'UTC+10' },
		{ label: 'UTC 0 (London Time)', value: 'UTC' },
	];

	const gender = [
		{ label: 'Male', value: 'M' },
		{ label: 'Female', value: 'F' },
		{ label: 'Other', value: 'O' },
		{ label: '-', value: 'A_' },
	];

	return (
		<Box component={Paper} elevation={4} className={classes.users}>
			<Backdrop style={{ zIndex: 1 }} open={getUserLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<div className={classes.headers}>
				<h1 style={{ marginBottom: 0 }}>{`${user.firstName} ${user.lastName}`}</h1>
				<div>{user.email}</div>
				<div>ID: {user.id}</div>
			</div>

			<Tabs
				value={selectedTab}
				onChange={(_, tab) => setSelectedTab(tab)}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				aria-label="scrollable tabs">
				<Tab label="Personal" />
				<Tab label="Administration" />
			</Tabs>

			<TabPanel value={selectedTab} index={0}>
				<h2>Personal Information</h2>
				<form onSubmit={personalInformationSubmitHandler(onPersonalInformationSubmmit)}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'firstName',
								'users.create.form.from_firstName',
								{
									required: true,
								},
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'middleName',
								'users.create.form.from_middleName',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'lastName',
								'users.create.form.from_lastName',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'email',
								'users.create.form.field.email',
								{
									type: 'email',
									required: true,
								},
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'mobileNumber',
								'users.create.form.from_mobileNumber',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderAutoComplete(
								personalInformationRegister,
								personalInformationErrors,
								'gender',
								gender,
								'users.create.form.from_gender',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							<DatePicker
								value={date}
								label={intl.formatMessage({ id: 'users.create.form.from_dateOfBirth.label' })}
								placeholder={intl.formatMessage({ id: 'users.create.form.from_dateOfBirth.placeholder' })}
								onChange={(newValue) => {
									setDate(newValue);
								}}
								renderInput={(params) => (
									<TextField
										{...dateOfBirthInputProps}
										inputRef={dateOfBirthRef}
										InputLabelProps={{ shrink: true }}
										error={!!personalInformationErrors.email}
										helperText={personalInformationErrors.email ? personalInformationErrors.email.message : ''}
										{...params}
										variant="standard"
										fullWidth
										required
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'address',
								'users.create.form.from_address',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'company',
								'users.create.form.from_companyName',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderAutoComplete(
								personalInformationRegister,
								personalInformationErrors,
								'nationality',
								nationality,
								'users.create.form.from_nationality',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderAutoComplete(
								personalInformationRegister,
								personalInformationErrors,
								'timezone',
								timezone,
								'users.create.form.from_timezone',
							)}
						</Grid>
						<Grid item xs={12} sm={6}>
							{renderTextField(
								personalInformationRegister,
								personalInformationErrors,
								'inviteCode',
								'users.create.form.from_inviteCode',
							)}
						</Grid>

						<Grid item xs={12} sm={2}>
							{renderSwitch(personalInformationRegister, control, 'isStaff', 'users.create.form.field.is_staff')}
						</Grid>
						<Grid item xs={12} sm={2}>
							{renderSwitch(personalInformationRegister, control, 'isSuperuser', 'users.create.form.field.is_superuser')}
						</Grid>
						<Grid item xs={12} sm={2}>
							{renderSwitch(personalInformationRegister, control, 'isActive', 'users.create.form.field.is_active')}
						</Grid>
					</Grid>

					<Box className={classes.actions}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<Button onClick={history.goBack} variant="contained" type="button" fullWidth>
									Back
								</Button>
							</Grid>
							<Grid item xs={12} sm={6}>
								<ButtonLoader
									variant="contained"
									tooltip={intl.formatMessage({ id: 'settings.form.button.update.tooltip' })}
									loader={updatePersonalInformationLoading}
									type="submit"
									fullWidth
									disabled={!isPersonalInformationValid || isPersonalInformationSubmitting}>
									Update
								</ButtonLoader>
							</Grid>
						</Grid>
					</Box>
				</form>
			</TabPanel>
			<TabPanel value={selectedTab} index={1}>
				<Grid container spacing={6}>
					<Grid item xs={12} sm={6}>
						<UserManagePassword user={user} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<UserResetPassword user={user} />
					</Grid>
				</Grid>
			</TabPanel>
		</Box>
	);
};

UserProfile.propTypes = {
	intl: PropTypes.object.isRequired,
};

export default injectIntl(UserProfile);
