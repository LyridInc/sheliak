import React from 'react';
import { Box } from '@mui/material';

import GridContainer from 'components/GridContainer';
import useDashboardStyles from 'assets/styles/Containers/Dashboard';
import UserActivity from './UserActivity';
import UserStats from './UserStats';

const Dashboard = () => {
	const classes = useDashboardStyles();

	return (
		<Box className={classes.dashboard}>
			<GridContainer>
				<UserStats />
				<UserActivity />
			</GridContainer>
		</Box>
	);
};

export default Dashboard;
