import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link as RouterLink } from 'react-router-dom';
import { Box, IconButton, InputAdornment, Link, TextField } from '@mui/material';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { AuthMutation } from 'graphql/mutations';
import { AuthConstant, URLConstant } from 'constants/index';
import { isLoggedInVar } from 'store/cache';
import { errorHandler } from 'store/Links/errorLink';
import IntlMessages from 'helpers/Utils/IntlMessages';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';
import useAuthStyles from 'assets/styles/Containers/AuthStyles';

const LoginForm = ({ intl }) => {
	const toasts = useToasts();
	const classes = useAuthStyles();
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	const [login, { loading }] = useMutation(AuthMutation.LOGIN, {
		onCompleted: (data) => {
			if (data['tokenAuth']['success']) {
				if (data['tokenAuth']['user']['isActive'] && data['tokenAuth']['user']['isStaff']) {
					localStorage.setItem(AuthConstant.AUTH_TOKEN, data['tokenAuth']['token']);
					localStorage.setItem(AuthConstant.AUTH_TOKEN_REFRESH, data['tokenAuth']['refreshToken']);
					isLoggedInVar(true);
				} else {
					toasts.addToast(<IntlMessages id={'login.failure.notStaff'} />, { appearance: 'error' });
				}
			} else {
				errorHandler(data['tokenAuth']);
			}
		},
	});

	const loginSchema = yup.object().shape({
		username: yup
			.string()
			.required(intl.formatMessage({ id: 'login.validation.email.required' }))
			.email(intl.formatMessage({ id: 'login.validation.email.valid' })),
		password: yup.string().required(),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		mode: 'all',
		resolver: yupResolver(loginSchema),
	});

	const { ref: usernameRef, ...usernameInputProps } = register('username');
	const { ref: passwordRef, ...passwordInputProps } = register('password');

	const onSubmit = (data) => {
		let variables = {
			email: data.username,
			password: data.password,
		};

		login({
			variables: variables,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
			<TextField
				{...usernameInputProps}
				hiddenLabel
				name="username"
				type="text"
				variant="filled"
				size="small"
				inputRef={usernameRef}
				margin="dense"
				error={!!errors.username}
				helperText={errors.username ? errors.username.message : ''}
				placeholder={intl.formatMessage({ id: 'login.email' })}
				fullWidth
				required
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<EmailIcon color="primary" />
						</InputAdornment>
					),
					disableUnderline: true,
				}}
			/>

			<TextField
				{...passwordInputProps}
				hiddenLabel
				name="password"
				type={showPassword ? 'text' : 'password'}
				size="small"
				variant="filled"
				inputRef={passwordRef}
				margin="dense"
				error={!!errors.password}
				helperText={errors.password ? errors.password.message : ''}
				fullWidth
				required
				placeholder={intl.formatMessage({ id: 'login.password' })}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<VpnKeyIcon color="primary" />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								size="small"
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}>
								{showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					),
					disableUnderline: true,
				}}
			/>

			<Box className={classes.loginActionBox}>
				<Link component={RouterLink} to={URLConstant.DASHBOARD}>
					{intl.formatMessage({ id: 'login.forgotPassword' })}
				</Link>
			</Box>

			<Box mt={4}>
				<ButtonLoader
					variant="contained"
					tooltip={intl.formatMessage({ id: 'login.button.tooltip' })}
					loader={loading}
					type="submit"
					fullWidth
					startIcon={<ExitToAppIcon />}
					disabled={!isValid || isSubmitting}>
					<IntlMessages id={'login.button'} />
				</ButtonLoader>
			</Box>
		</form>
	);
};

LoginForm.propTypes = {
	onSubmit: PropTypes.func,
	intl: PropTypes.object.isRequired,
};

export default injectIntl(LoginForm);
