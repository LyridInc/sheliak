import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Card, CardContent, Grid, Typography } from '@mui/material';

import IntlMessages from 'helpers/Utils/IntlMessages';
import PercentIcons from 'components/PercentIcons';
import useDashboardStyles from 'assets/styles/Containers/Dashboard';

const UserStats = ({ intl, data }) => {
	const classes = useDashboardStyles();

	const totalRegistrations = _.get(data, 'accountStatistics.total', 0);
	const totalRegistrationsXDays = _.get(data, 'accountStatistics.lastXDays.total', 0);
	const registrationTrendsInPercent = _.get(data, 'accountStatistics.trendsInPercent.percentageChangeJoined', 0);

	const verifiedUsers = _.get(data, 'accountStatistics.verified', 0);
	const verifiedUsersXDays = _.get(data, 'accountStatistics.lastXDays.verified', 0);
	const verificationTrendsInPercent = _.get(data, 'accountStatistics.trendsInPercent.percentageChangeVerified', 0);

	const activeUsers = _.get(data, 'accountStatistics.activeUsers', 0);
	const activeUsersXDays = _.get(data, 'accountStatistics.lastXDays.activeUsers', 0);
	const loginsTrendsInPercent = _.get(data, 'accountStatistics.trendsInPercent.percentageChangeLogins', 0);

	return (
		<>
			<Grid item sm={12} lg={4}>
				<Card elevation={8} className={classes.userStatsCard}>
					<CardContent className={classes.userStatsCardContent}>
						<Typography color="text.secondary" gutterBottom>
							<IntlMessages id={'dashboard.userStats.registrationUsersTitle'} />
						</Typography>
						<Typography variant="h2" component="div" color={'primary'}>
							{totalRegistrationsXDays}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							<IntlMessages id={'dashboard.userStats.registrationsUsersTotal'} />
							{' - '}
							<Typography component="span" fontWeight="bold" fontSize={'small'}>
								{totalRegistrations}
							</Typography>
						</Typography>
					</CardContent>
					<CardContent className={classes.userStatsCardContent}>
						<PercentIcons
							value={parseFloat(registrationTrendsInPercent)}
							tooltip={intl.formatMessage({ id: 'dashboard.userStats.tooltip.registrationUsersTrends' })}
						/>
					</CardContent>
				</Card>
			</Grid>

			<Grid item sm={12} lg={4}>
				<Card elevation={8} className={classes.userStatsCard}>
					<CardContent className={classes.userStatsCardContent}>
						<Typography color="text.secondary" gutterBottom>
							<IntlMessages id={'dashboard.userStats.verifiedUsersTitle'} />
						</Typography>
						<Typography variant="h2" component="div" color={'primary'}>
							{verifiedUsersXDays}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							<IntlMessages id={'dashboard.userStats.verifiedUsersTotal'} />
							{' - '}
							<Typography component="span" fontWeight="bold" fontSize={'small'}>
								{verifiedUsers}
							</Typography>
						</Typography>
					</CardContent>
					<CardContent className={classes.userStatsCardContent}>
						<PercentIcons
							value={parseFloat(verificationTrendsInPercent)}
							tooltip={intl.formatMessage({ id: 'dashboard.userStats.tooltip.verifiedUsersTrends' })}
						/>
					</CardContent>
				</Card>
			</Grid>

			<Grid item sm={12} lg={4}>
				<Card elevation={8} className={classes.userStatsCard}>
					<CardContent className={classes.userStatsCardContent}>
						<Typography color="text.secondary" gutterBottom>
							<IntlMessages id={'dashboard.userStats.activeUsersTitle'} />
						</Typography>
						<Typography variant="h2" component="div" color={'primary'}>
							{activeUsersXDays}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							<IntlMessages id={'dashboard.userStats.activeUsersTotal'} />
							{' - '}
							<Typography component="span" fontWeight="bold" fontSize={'small'}>
								{activeUsers}
							</Typography>
						</Typography>
					</CardContent>
					<CardContent className={classes.userStatsCardContent}>
						<PercentIcons
							value={parseFloat(loginsTrendsInPercent)}
							tooltip={intl.formatMessage({ id: 'dashboard.userStats.tooltip.activeUsersTrends' })}
						/>
					</CardContent>
				</Card>
			</Grid>
		</>
	);
};

UserStats.propTypes = {
	intl: PropTypes.object.isRequired,
	data: PropTypes.object,
};

export default injectIntl(UserStats);
