import makeStyles from '@mui/styles/makeStyles';

const useDashboardStyles = makeStyles((theme) => ({
	dashboard: {
		padding: theme.spacing(2),
	},

	activityChartHeader: {
		display: 'flex',
		justifyContent: 'space-between',
	},

	activityChartHeaderText: {
		display: 'flex',
		flexDirection: 'column',
	},

	userStatsCard: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: theme.spacing(2),
	},

	userStatsCardContent: {
		padding: `${theme.spacing(0)} !important`,
	},
}));

export default useDashboardStyles;
