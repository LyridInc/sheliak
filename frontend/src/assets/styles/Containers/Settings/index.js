import makeStyles from '@mui/styles/makeStyles';

const useSettingsStyles = makeStyles((theme) => ({
	settings: {
		padding: theme.spacing(2),
		paddingBottom: theme.spacing(10),
		margin: theme.spacing(2),
		height: 'auto',
		position: 'relative',
	},

	actions: {
		position: 'absolute',
		bottom: theme.spacing(1),
		right: theme.spacing(2),
	},
}));

export default useSettingsStyles;
