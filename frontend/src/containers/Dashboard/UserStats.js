import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';

import { DashboardQuery } from 'graphql/queries';
import IntlMessages from 'helpers/Utils/IntlMessages';
import PercentIcons from 'components/PercentIcons';
import useDashboardStyles from 'assets/styles/Containers/Dashboard';

const UserStats = ({ intl }) => {
	const classes = useDashboardStyles();
	// TODO: loading
	const { data } = useQuery(DashboardQuery.GET_ACCOUNT_STATISTICS);

	const totalUsers = _.get(data, 'accountStatistics.total', 0);
	const totalUsersLast90 = _.get(data, 'accountStatistics.last90Days.total', 0);
	const totalUsersTrend7 = _.get(data, 'accountStatistics.last7DaysTrends.percentTotal', 0);

	const verifiedUsers = _.get(data, 'accountStatistics.verified', 0);
	const verifiedUsersLast90 = _.get(data, 'accountStatistics.last90Days.verified', 0);
	const verifiedUsersTrend7 = _.get(data, 'accountStatistics.last7DaysTrends.percentVerified', 0);

	return (
		<>
			<Grid item xs={12} sm={6}>
				<Card elevation={8} className={classes.userStatsCard}>
					<CardContent className={classes.userStatsCardContent}>
						<Typography color="text.secondary" gutterBottom>
							<IntlMessages id={'dashboard.userStats.totalUsersTitle'} />
						</Typography>
						<Typography variant="h2" component="div" color={'primary'}>
							{totalUsers}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							<IntlMessages id={'dashboard.userStats.totalUsersLast90'} />
							{' - '}
							<Typography component="span" fontWeight="bold" fontSize={'small'}>
								{totalUsersLast90}
							</Typography>
						</Typography>
					</CardContent>
					<CardContent className={classes.userStatsCardContent}>
						<PercentIcons
							value={parseFloat(totalUsersTrend7)}
							tooltip={intl.formatMessage({ id: 'dashboard.userStats.tooltip.trends7' })}
						/>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12} sm={6}>
				<Card elevation={8} className={classes.userStatsCard}>
					<CardContent className={classes.userStatsCardContent}>
						<Typography color="text.secondary" gutterBottom>
							<IntlMessages id={'dashboard.userStats.verifiedUsersTitle'} />
						</Typography>
						<Typography variant="h2" component="div" color={'primary'}>
							{verifiedUsers}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							<IntlMessages id={'dashboard.userStats.verifiedUsersLast90'} />
							{' - '}
							<Typography component="span" fontWeight="bold" fontSize={'small'}>
								{verifiedUsersLast90}
							</Typography>
						</Typography>
					</CardContent>
					<CardContent className={classes.userStatsCardContent}>
						<PercentIcons
							value={parseFloat(verifiedUsersTrend7)}
							tooltip={intl.formatMessage({ id: 'dashboard.userStats.tooltip.trends7' })}
						/>
					</CardContent>
				</Card>
			</Grid>
		</>
	);
};

UserStats.propTypes = {
	intl: PropTypes.object.isRequired,
};

export default injectIntl(UserStats);
