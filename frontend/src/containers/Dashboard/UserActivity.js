import React, { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@apollo/client';
import { Box, Grid, Paper, Typography } from '@mui/material';

import { DashboardQuery } from 'graphql/queries';
import DateRange from 'components/Pickers/DateRange';
import ActivityGraph from 'components/Graphs/ActivityGraph';
import IntlMessages from 'helpers/Utils/IntlMessages';
import useDashboardStyles from 'assets/styles/Containers/Dashboard';

const UserActivity = () => {
	const classes = useDashboardStyles();
	const [data, setData] = useState({});
	const [selectionRange, setSelectionRange] = useState({
		startDate: new Date(Date.now() - 12096e5), // Magic number for two weeks.
		endDate: new Date(),
		key: 'selection',
	});

	// TODO:
	// Implement debounce to optimize the code.
	// Make sure the query doesn't get fired on each page reload.
	// Maybe useLazyQuery to fetch the chart data.
	useQuery(DashboardQuery.GET_LOGIN_STATISTICS, {
		variables: {
			dateRange: JSON.stringify([
				format(selectionRange.startDate, 'yyyy-MM-dd'),
				format(selectionRange.endDate, 'yyyy-MM-dd'),
			]),
		},
		onCompleted: (data) => {
			setData(data.loginStatistics);
		},
	});

	return (
		<Grid item xs={12}>
			<Box component={Paper} elevation={8} p={2}>
				<Box className={classes.activityChartHeader}>
					<Box className={classes.activityChartHeaderText} mb={2}>
						<Typography component="div" variant="h5">
							<IntlMessages id={'dashboard.userActivity.title'} />
						</Typography>
						<Typography component="div" variant="caption" color="textSecondary">
							<IntlMessages id={'dashboard.userActivity.titleTagLine'} />
						</Typography>
					</Box>

					<DateRange selectionRange={selectionRange} setSelectionRange={setSelectionRange} />
				</Box>

				<ActivityGraph data={data} />
			</Box>
		</Grid>
	);
};

export default UserActivity;
