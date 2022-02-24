import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Paper, Button } from '@mui/material';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';
import useUsersStyles from 'assets/styles/Containers/Users';
import { injectIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { UsersMutation } from '../../graphql/mutations';
import { useToasts } from 'react-toast-notifications';
import { renderTextField, renderSwitch } from '../../components/Input';
import { URLConstant } from 'constants/index';
import { useHistory } from 'react-router-dom';

const UserCreate = ({ intl }) => {
	const history = useHistory();
	const { addToast } = useToasts();
	const classes = useUsersStyles();

	const createUserSchema = yup.object().shape({
		email: yup.string().required('Email field is required').email('Email must be a valid email address'),
		password: yup.string().required('Password is required'),
		firstName: yup.string().required('Enter your first name'),
		mobileNumber: yup.string(),
		isStaff: yup.boolean().default(false),
		isSuperuser: yup.boolean().default(false),
		isActive: yup.boolean().default(false),
	});

	const {
		register: createUserRegister,
		handleSubmit: createUserSubmitHandler,
		formState: { errors: createUserErrors, isValid: isCreateUserValid, isSubmitting: isCreateUserSubmitting },
		control: personalInformationController,
	} = useForm({
		mode: 'all',
		resolver: yupResolver(createUserSchema),
	});

	const [registerAdmin, { loading: createUserLoading }] = useMutation(UsersMutation.REGIS_ADMIN, {
		onCompleted: (data) => {
			// console.log(data);
			if (data && data.registerAdmin) {
				const response = data.registerAdmin;
				if (response.success) {
					addToast(intl.formatMessage({ id: 'users.create.response.success' }), { appearance: 'success' });
					history.push(`/app/users/${data.registerAdmin.user.id}/manage-profile`);
				} else {
					const errors = response.errors;
					if (errors.length > 0) {
						addToast(errors[0].message, { appearance: 'error' });
					} else {
						addToast(intl.formatMessage({ id: 'users.create.response.error' }), { appearance: 'error' });
					}
				}
			} else {
				addToast(intl.formatMessage({ id: 'users.create.response.error' }), { appearance: 'error' });
			}
		},
	});

	const onCreateUserSubmit = (data) => {
		let finalizedData = {};
		const coreKeys = Object.keys(createUserSchema);
		coreKeys.forEach((key) => (finalizedData[key] = data[key]));
		// console.log(data);

		registerAdmin({
			variables: {
				email: data.email,
				password: data.password,
				mobileNumber: data.mobileNumber,
				firstName: data.firstName,
				isActive: data.isActive,
				isStaff: data.isStaff,
				isSuperuser: data.isSuperuser,
			},
		});
		return finalizedData;
	};

	return (
		<Box component={Paper} elevation={4} className={classes.users}>
			<h2>Create User</h2>
			<form onSubmit={createUserSubmitHandler(onCreateUserSubmit)}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						{renderTextField(createUserRegister, createUserErrors, 'email', 'users.create.form.field.email', 'email')}
					</Grid>
					<Grid item xs={12} sm={6}>
						{renderTextField(createUserRegister, createUserErrors, 'firstName', 'users.create.form.from_firstName')}
					</Grid>
					<Grid item xs={12} sm={6}>
						{renderTextField(
							createUserRegister,
							createUserErrors,
							'password',
							'users.create.form.field.new_password',
							'password',
						)}
					</Grid>
					<Grid item xs={12} sm={6}>
						{renderTextField(createUserRegister, createUserErrors, 'mobileNumber', 'users.create.form.from_mobileNumber')}
					</Grid>

					<Grid item xs={12} sm={1.5}>
						<Box display="flex" justifyContent="flex-end">
							{renderSwitch(createUserRegister, personalInformationController, 'isActive', 'users.create.form.field.active')}
						</Box>
					</Grid>
					<Grid item xs={12} sm={1.4}>
						<Box display="flex" justifyContent="flex-end">
							{renderSwitch(
								createUserRegister,
								personalInformationController,
								'isStaff',
								'users.create.form.field.is_staff',
							)}
						</Box>
					</Grid>
					<Grid item xs={12} sm={1.6}>
						<Box display="flex" justifyContent="flex-end">
							{renderSwitch(
								createUserRegister,
								personalInformationController,
								'isSuperuser',
								'users.create.form.field.is_superuser',
							)}
						</Box>
					</Grid>
				</Grid>
				<br />
				<Box className={classes.actions}>
					<Box className={classes.floatButton}>
						<Button variant="contained" type="submit" fullWidth href={URLConstant.USERS}>
							Back
						</Button>
					</Box>
					<Box className={classes.floatButton}>
						<ButtonLoader
							variant="contained"
							loader={createUserLoading}
							type="submit"
							fullWidth
							disabled={!isCreateUserValid || isCreateUserSubmitting}>
							Create
						</ButtonLoader>
					</Box>
				</Box>
			</form>
			{/*</TabPanel>*/}
		</Box>
	);
};

UserCreate.propTypes = {
	intl: PropTypes.object.isRequired,
	user: PropTypes.object,
};

export default injectIntl(UserCreate);
