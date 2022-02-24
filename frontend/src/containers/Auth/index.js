import React from 'react';
import { Route } from 'react-router';
import { Box, Paper } from '@mui/material';
import { Switch } from 'react-router-dom';

import { LOGO } from 'assets/images';
import LoginForm from './LoginForm';
import { URLConstant } from 'constants/index';
import useAuthStyles from 'assets/styles/Containers/AuthStyles';

const AuthContainer = () => {
	const classes = useAuthStyles();

	return (
		<Box component={Paper} elevation={12} p={2} className={classes.authBox}>
			<Box className={classes.logo}>
				<img src={LOGO.default} alt="" />
			</Box>
			<Switch>
				<Route path={URLConstant.LOGIN} component={LoginForm} />
			</Switch>
		</Box>
	);
};

export default AuthContainer;
