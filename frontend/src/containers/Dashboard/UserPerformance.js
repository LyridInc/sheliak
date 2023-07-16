import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IntlMessages from 'helpers/Utils/IntlMessages';
import useDashboardStyles from 'assets/styles/Containers/Dashboard';

// eslint-disable-next-line no-unused-vars
const UserPerformance = ({ intl, data }) => {
	const classes = useDashboardStyles();

	const rows = _.get(data, 'accountStatistics.top10Logins', {});

	return (
		<Grid item xs={12}>
			<Box component={Paper} elevation={8} p={2}>
				<Box className={classes.activityChartHeader}>
					<Box className={classes.activityChartHeaderText} mb={2}>
						<Typography component="div" variant="h5">
							<IntlMessages id={'dashboard.userPerformance.title'} />
						</Typography>
						<Typography component="div" variant="caption" color="textSecondary">
							<IntlMessages id={'dashboard.userPerformance.titleTagLine'} />
						</Typography>
					</Box>
				</Box>

				<Box>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="right">Email</TableCell>
									<TableCell align="right">Is Superuser?</TableCell>
									<TableCell align="right">ID</TableCell>
									<TableCell align="right">No. of Logins</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{_.map(rows, (row) => (
									<TableRow key={row?.user?.pk} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell component="th" scope="row">
											{row?.user?.fullName}
										</TableCell>
										<TableCell align="right">{row?.user?.email}</TableCell>
										<TableCell align="right">{row?.user?.isSuperuser ? 'True' : 'False'}</TableCell>
										<TableCell align="right">{row?.user?.pk}</TableCell>
										<TableCell align="right">{row?.logins}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			</Box>
		</Grid>
	);
};

UserPerformance.propTypes = {
	intl: PropTypes.object.isRequired,
	data: PropTypes.object,
};

export default injectIntl(UserPerformance);
