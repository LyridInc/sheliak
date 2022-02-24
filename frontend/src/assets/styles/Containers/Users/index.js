import makeStyles from '@mui/styles/makeStyles';

const useUsersStyles = makeStyles((theme) => ({
	users: {
		padding: theme.spacing(2),
		margin: theme.spacing(2),
		height: 'auto',
		position: 'relative',
	},

	actions: {
		display: 'flex',
		position: 'absolute',
		bottom: theme.spacing(1),
		right: theme.spacing(2),
	},

	floatButton: { marginLeft: 5 },
	headers: {
		marginBottom: theme.spacing(4),
		marginLeft: theme.spacing(2),
	},
}));

export default useUsersStyles;
