import makeStyles from '@mui/styles/makeStyles';

const useGraphStyles = makeStyles((theme) => ({
	tooltip: {
		position: 'relative',
		borderRadius: 6,
		padding: '4px 12px',
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
}));

export default useGraphStyles;
