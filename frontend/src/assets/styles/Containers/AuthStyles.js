import makeStyles from '@mui/styles/makeStyles';

const useAuthStyles = makeStyles((theme) => ({
	authBox: {
		width: 320,
	},

	loginActionBox: {
		display: 'flex',
		justifyContent: 'end',
	},

	logo: {
		display: 'flex',
		flexDirection: 'column',
		paddingBottom: theme.spacing(4),
	},
}));

export default useAuthStyles;
