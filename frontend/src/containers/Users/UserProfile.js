import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { parseISO } from 'date-fns';
import { injectIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { useMutation, useLazyQuery } from '@apollo/client';
import { deepOrange } from '@mui/material/colors';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToasts } from 'react-toast-notifications';
import { useHistory, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Grid, Paper, Tab, Tabs } from '@mui/material';
import { Facebook as UserManageSkeleton } from 'react-content-loader';

import TabPanel from 'components/TabPanel';
import { HelperQuery, UsersQuery } from 'graphql/queries';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';
import UserResetPassword from './UserPassword/UserResetPassword';
import UserManagePassword from './UserPassword/UserManagePassword';
import { renderAutoComplete, renderDatePickerField, renderSwitch, renderTextField } from 'components/Input';
import { UsersMutation } from 'graphql/mutations';
import { errorHandler } from 'store/Links/errorLink';

const formFields = {
	email: '',
	firstName: '',
	middleName: '',
	lastName: '',
	isStaff: false,
	isActive: false,
	isSuperuser: false,
	mobileNumber: '',

	gender: '',
	picture: '',
	dateOfBirth: '',
	nationality: '',
	timezone: '',
	address: '',
	inviteCode: '',
	company: '',
	legacyId: '',
	extraInfo: '',
};

const userSchema = yup.object().shape({
	email: yup.string().required('Email field is required').email('Email must be a valid email address'),
	firstName: yup.string().required('Enter your first name'),
	middleName: yup.string(),
	lastName: yup.string(),
	isStaff: yup.boolean(),
	isActive: yup.boolean(),
	isSuperUser: yup.boolean(),
	mobileNumber: yup.string(),

	// Profile fields
	gender: yup.string(),
	picture: yup.string(),
	dateOfBirth: yup.string(),
	nationality: yup.string(),
	timezone: yup.string(),
	address: yup.string(),
	inviteCode: yup.string(),
	company: yup.string(),
	legacyId: yup.string(),
	extraInfo: yup.string(),
});

const genderOptions = [
	{ label: 'Male', value: 'M' },
	{ label: 'Female', value: 'F' },
	{ label: 'Other', value: 'O' },
	{ label: '-', value: '' },
];

const UserProfile = ({ intl }) => {
	const { id } = useParams();
	const history = useHistory();
	const { addToast } = useToasts();
	const [selectedTab, setSelectedTab] = useState(0);
	const [user, setUser] = useState();

	const {
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting, isDirty },
		control,
	} = useForm({
		mode: 'all',
		resolver: yupResolver(userSchema),
	});

	const [getNationalities, { data: nationalityOptions, loading: nationalityQueryLoading }] = useLazyQuery(
		HelperQuery.GET_NATIONALITIES,
	);
	const [getTimezones, { data: timezoneOptions, loading: timezoneQueryLoading }] = useLazyQuery(HelperQuery.GET_TIMEZONES);
	const [getUser, { data: userData, loading: userQueryLoading }] = useLazyQuery(UsersQuery.GET_USER, {
		fetchPolicy: 'network-only',
		variables: {
			id,
		},
	});

	const [updateAccount, { loading: updateLoading }] = useMutation(UsersMutation.USER_UPDATE_ACCOUNT_ADMIN, {
		onCompleted: (data) => {
			if (data && data.updateAccountAdmin) {
				const response = data.updateAccountAdmin;
				let errors = [{ message: intl.formatMessage({ id: 'users.update.response.error' }) }];
				if (response.success) {
					addToast(intl.formatMessage({ id: 'users.update.response.success' }), { appearance: 'success' });
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

	const onSubmit = (json) => {
		const dob = new Date(json.dateOfBirth);
		const year = dob.getFullYear();
		const month = ('0' + (dob.getMonth() + 1)).slice(-2);
		const day = ('0' + dob.getDate()).slice(-2);
		const dobString = `${year}-${month}-${day}`;

		const formattedData = {
			email: json.email,
			firstName: json.firstName,
			isActive: json.isActive,
			isStaff: json.isStaff,
			isSuperuser: json.isSuperuser,
			lastName: json.lastName,
			middleName: json.middleName,
			mobileNumber: json.mobileNumber,
			profile: {
				address: json.address,
				company: json.company,
				dateOfBirth: dobString,
				extraInfo: json.extraInfo,
				gender: json.gender,
				inviteCode: json.inviteCode,
				legacyId: json.legacyId,
				nationality: json.nationality,
				picture: json.picture,
				timezone: json.timezone,
			},
		};

		updateAccount({
			variables: {
				id: user.pk,
				input: formattedData,
			},
		});
	};

	function populateFormFields(formData) {
		const populatedFormFields = { ...formFields };

		Object.keys(populatedFormFields).forEach((key) => {
			if (key in formData) {
				populatedFormFields[key] = formData[key];
			} else if (key === 'dateOfBirth' && key in formData.profile) {
				populatedFormFields[key] = parseISO(formData.profile[key]);
			} else if (key in formData.profile) {
				populatedFormFields[key] = formData.profile[key];
			}
		});

		return populatedFormFields;
	}

	useEffect(() => {
		getUser();
		getTimezones();
		getNationalities();
		// eslint-disable-next-line
	},[])

	useEffect(() => {
		if (!userQueryLoading && !timezoneQueryLoading && !nationalityQueryLoading) {
			if (userData && nationalityOptions && timezoneOptions) {
				setUser(userData.user);
				const defaultValues = populateFormFields(userData.user);
				reset({ ...defaultValues });
			}
		}
		// eslint-disable-next-line
	}, [userQueryLoading, timezoneQueryLoading, nationalityQueryLoading]);

	return (
		<Box component={Paper} elevation={4} sx={{ minHeight: 'calc(100vh - 80px)', padding: 2, margin: 2 }}>
			{!user || userQueryLoading || timezoneQueryLoading || nationalityQueryLoading ? (
				<UserManageSkeleton />
			) : (
				<>
					<Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
						<Box sx={{ flexShrink: 0, marginRight: 2 }}>
							{user.picture ? (
								<Avatar
									src={user.picture}
									alt={user.firstName}
									variant="rounded"
									sx={{
										width: 100,
										height: 100,
										boxShadow: '0 0 5px rgba(0,0,0,0.3)',
									}}
								/>
							) : (
								<Avatar
									variant="rounded"
									sx={{
										width: 100,
										height: 100,
										fontSize: '6rem',
										backgroundColor: deepOrange[500],
										boxShadow: '0 0 5px rgba(0,0,0,0.3)',
									}}>
									{user.firstName.charAt(0).toUpperCase()}
								</Avatar>
							)}
						</Box>
						<Box sx={{ flex: 1 }}>
							<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
								<h1 style={{ margin: 0 }}>{`${user.firstName} ${user.lastName}`}</h1>
								<div>{user.email}</div>
								<div>ID: {user.id}</div>
							</Box>
						</Box>
					</Box>

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
						<form onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'email', 'users.create.form.field.email', {
										type: 'email',
										required: true,
									})}
								</Grid>
								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'firstName', 'users.create.form.field.firstName', {
										required: true,
									})}
								</Grid>

								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'middleName', 'users.create.form.field.middleName')}
								</Grid>
								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'lastName', 'users.create.form.field.lastName')}
								</Grid>

								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'mobileNumber', 'users.create.form.field.mobileNumber')}
								</Grid>
								<Grid item xs={12} sm={6}>
									{renderAutoComplete(control, errors, 'gender', genderOptions, 'users.create.form.field.gender')}
								</Grid>

								<Grid item xs={12} sm={6}>
									{renderDatePickerField(control, errors, 'dateOfBirth', 'users.create.form.field.dateOfBirth')}
								</Grid>
								<Grid item xs={12} sm={6}>
									{renderAutoComplete(
										control,
										errors,
										'nationality',
										nationalityOptions?.allNationalities,
										'users.create.form.field.nationality',
									)}
								</Grid>

								<Grid item xs={12} sm={6}>
									{renderAutoComplete(
										control,
										errors,
										'timezone',
										timezoneOptions?.allTimezones,
										'users.create.form.field.timezone',
									)}
								</Grid>
								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'address', 'users.create.form.field.address')}
								</Grid>

								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'inviteCode', 'users.create.form.field.inviteCode')}
								</Grid>
								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'company', 'users.create.form.field.companyName')}
								</Grid>

								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'legacyId', 'users.create.form.field.legacyId')}
								</Grid>
								<Grid item xs={12} sm={6}>
									{renderTextField(control, errors, 'extraInfo', 'users.create.form.field.extraInfo')}
								</Grid>

								<Grid item xs={12} sm={2}>
									{renderSwitch(control, 'isStaff', 'users.create.form.field.is_staff')}
								</Grid>
								<Grid item xs={12} sm={2}>
									{renderSwitch(control, 'isSuperuser', 'users.create.form.field.is_superuser')}
								</Grid>
								<Grid item xs={12} sm={2}>
									{renderSwitch(control, 'isActive', 'users.create.form.field.is_active')}
								</Grid>

								<Grid container justifyContent="flex-end" spacing={2}>
									<Grid item>
										<Button onClick={history.goBack} variant="contained" type="button">
											Back
										</Button>
									</Grid>
									<Grid item>
										<ButtonLoader
											variant="contained"
											tooltip={intl.formatMessage({ id: 'settings.form.button.update.tooltip' })}
											loader={updateLoading}
											type="submit"
											disabled={!isValid || isSubmitting || !isDirty}>
											Update
										</ButtonLoader>
									</Grid>
								</Grid>
							</Grid>
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
				</>
			)}
		</Box>
	);
};

UserProfile.propTypes = {
	intl: PropTypes.object.isRequired,
};

export default injectIntl(UserProfile);
