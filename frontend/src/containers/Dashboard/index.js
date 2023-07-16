import React, { useState } from 'react';
import { format } from 'date-fns';
import { Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useQuery } from '@apollo/client';

import { DashboardQuery } from 'graphql/queries';
import GridContainer from 'components/GridContainer';
import DateRange from 'components/Pickers/DateRange';
import useDashboardStyles from 'assets/styles/Containers/Dashboard';
import UserActivity from './UserActivity';
import UserGrowth from './UserGrowth';
import UserStats from './UserStats';
import UserPerformance from './UserPerformance';
import IntlMessages from 'helpers/Utils/IntlMessages';

const Dashboard = () => {
	const classes = useDashboardStyles();
	const [selectionRange, setSelectionRange] = useState({
		startDate: new Date(Date.now() - 12096e5), // Magic number for two weeks.
		endDate: new Date(),
		key: 'selection',
	});

	const { data: stats_data } = useQuery(DashboardQuery.GET_ACCOUNT_STATISTICS, {
		variables: {
			dateStart: format(selectionRange.startDate, 'yyyy-MM-dd'),
			dateEnd: format(selectionRange.endDate, 'yyyy-MM-dd'),
		},
	});

	return (
		<Box className={classes.dashboard}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2, paddingBottom: 2 }}>
				<Typography component="div" variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
					<DashboardIcon />
					<IntlMessages id={'dashboard.title'} />
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography component="div" variant="h5" sx={{ paddingRight: 1 }}>
						<IntlMessages id={'dashboard.selectDateRange'} />
					</Typography>
					<DateRange selectionRange={selectionRange} setSelectionRange={setSelectionRange} />
				</Box>
			</Box>
			<GridContainer>
				<UserStats data={stats_data} />
				<UserGrowth selectionRange={selectionRange} />
				<UserPerformance data={stats_data} />
				<UserActivity selectionRange={selectionRange} />
			</GridContainer>
		</Box>
	);
};

export default Dashboard;
