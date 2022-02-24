import React from 'react';
import { Box, Paper } from '@mui/material';

import StackForm from './StackForm';
import useSettingsStyles from 'assets/styles/Containers/Settings';

const Settings = () => {
	const classes = useSettingsStyles();

	return (
		<Box component={Paper} elevation={4} className={classes.settings}>
			<StackForm />
		</Box>
	);
};

export default Settings;
