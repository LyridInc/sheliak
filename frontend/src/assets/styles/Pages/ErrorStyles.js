import { makeStyles } from '@mui/styles';

const useErrorStyles = makeStyles((theme) => ({
	root: {
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		textAlign: 'center',
	},

	background: {
		width: 'auto',
	},

	title: {
		fontSize: '150px !important',
		lineHeight: `1.2 !important`,
		fontWeight: `100 !important`,
		display: 'inline-table',
		position: 'relative',
		background: theme.palette.primary.main,
		color: '#fff',
		padding: `0 ${theme.spacing(2)}`,
		borderRadius: '60px',
		cursor: 'pointer',
		margin: `0 0 ${theme.spacing(1)} !important`,

		'&:after': {
			top: '100%',
			left: '50%',
			border: 'solid transparent',
			content: '""',
			height: 0,
			width: 0,
			position: 'absolute',
			pointerEvents: 'none',
			borderColor: 'rgba(0, 0, 0, 0)',
			borderTopColor: theme.palette.primary.main,
			borderWidth: '8px',
			marginLeft: '-8px',
		},
	},

	subtitle: {
		fontSize: `${theme.spacing(4)} !important`,
		fontWeight: `900 !important`,
	},

	errorBox: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: `calc(100vh - 48px)`,
	},
}));

export default useErrorStyles;
