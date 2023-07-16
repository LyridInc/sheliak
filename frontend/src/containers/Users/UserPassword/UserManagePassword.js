import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { injectIntl } from 'react-intl';
import { renderTextField } from 'components/Input';
import { useMutation } from '@apollo/client';
import { UsersMutation } from 'graphql/mutations';
import { useToasts } from 'react-toast-notifications';
import { errorHandler } from 'store/Links/errorLink';

const UserManagePassword = ({ intl, user }) => {
	const { addToast } = useToasts();
	const changePasswordSchema = yup.object().shape({
		newPassword: yup.string().required(),
		confirmPassword: yup
			.string()
			.required()
			.oneOf([yup.ref('newPassword'), null], 'Password must match'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		mode: 'all',
		resolver: yupResolver(changePasswordSchema),
	});

	const [changePassword, { loading }] = useMutation(UsersMutation.USER_CHANGE_PASSWORD_ADMIN, {
		onCompleted: (data) => {
			if (data && data.passwordSetAdmin) {
				const response = data.passwordSetAdmin;
				let errors = [{ message: intl.formatMessage({ id: 'users.manage.password.change.response.error' }) }];
				if (response.success) {
					addToast(intl.formatMessage({ id: 'users.manage.password.change.response.success' }), { appearance: 'success' });
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

	const onSubmitChangePassword = (data) => {
		changePassword({
			variables: {
				newPassword1: data.newPassword,
				newPassword2: data.confirmPassword,
				userId: user.id,
			},
		});
	};

	return (
		<React.Fragment>
			<h2>{intl.formatMessage({ id: 'users.manage.password.change.form.header' })}</h2>
			<form onSubmit={handleSubmit(onSubmitChangePassword)} autoComplete="off">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12}>
						{renderTextField(register, errors, 'newPassword', 'users.manage.form.field.new_password', {
							type: 'password',
						})}
					</Grid>
					<Grid item xs={12} sm={12}>
						{renderTextField(register, errors, 'confirmPassword', 'users.manage.form.field.confirm_password', {
							type: 'password',
						})}
					</Grid>
				</Grid>

				<Box mt={2}>
					<ButtonLoader tooltip="" variant="contained" loader={loading} disabled={!isValid || isSubmitting} type="submit">
						{intl.formatMessage({ id: 'users.manage.password.change.form.button' })}
					</ButtonLoader>
				</Box>
			</form>
		</React.Fragment>
	);
};

UserManagePassword.propTypes = {
	intl: PropTypes.object.isRequired,
	user: PropTypes.object,
};

export default injectIntl(UserManagePassword);
