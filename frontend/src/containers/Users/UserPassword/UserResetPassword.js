import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Snackbar, Alert } from '@mui/material';
import { useMutation } from '@apollo/client';
import { AuthMutation } from 'graphql/mutations';
import { injectIntl } from 'react-intl';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';

const UserResetPassword = ({ intl, user }) => {
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [sendPasswordResetMail, { loading: sendPasswordResetMailLoading }] = useMutation(
		AuthMutation.SEND_PASSWORD_RESET_MAIL,
		{
			onCompleted: (data) => {
				if (data?.sendPasswordResetEmail?.success) {
					setOpenSnackbar(true);
				}
			},
		},
	);

	const sendResetPassword = () => {
		if (user?.email) {
			sendPasswordResetMail({
				variables: {
					email: user.email,
				},
			});
		}
	};

	const handleCloseSnackbar = (_, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackbar(false);
	};

	return (
		<React.Fragment>
			<Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
					{intl.formatMessage({ id: 'users.manage.password.reset.feedback.success' })}
				</Alert>
			</Snackbar>
			<h2>Reset Password</h2>
			<form noValidate autoComplete="off">
				<TextField
					disabled
					value={user?.email || ``}
					label="Email"
					size="small"
					margin="dense"
					variant="standard"
					fullWidth
				/>

				<Box mt={2}>
					<ButtonLoader
						tooltip=""
						variant="contained"
						loader={sendPasswordResetMailLoading}
						type="button"
						onClick={sendResetPassword}>
						{intl.formatMessage({ id: 'users.manage.password.reset.form.button' })}
					</ButtonLoader>
				</Box>
			</form>
		</React.Fragment>
	);
};

UserResetPassword.propTypes = {
	intl: PropTypes.object.isRequired,
	user: PropTypes.object,
};

export default injectIntl(UserResetPassword);
