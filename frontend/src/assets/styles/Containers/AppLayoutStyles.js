import makeStyles from '@mui/styles/makeStyles';

const useAppLayoutStyles = makeStyles((theme) => ({
	landingBox: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '100vh',
	},

	appBox: {
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
		height: '100vh',
	},

	mainBox: {
		marginLeft: (props) => (props.open ? '240px' : `calc(${theme.spacing(7)} + 3px)`),
		height: '100vh !important',
		borderRadius: '0 !important',
		overflow: 'scroll',
	},

	appBar: {
		position: 'fixed !important',
		zIndex: `${theme.zIndex.drawer + 1} !important`,
		backgroundColor: '#ffffff !important',
	},

	appLogo: {
		display: 'flex',
		'& img': {
			maxHeight: theme.spacing(4),
		},
	},

	userBox: {
		display: 'flex',
	},

	userInfo: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		color: theme.palette.primary.main,
		marginRight: theme.spacing(0.5),

		'& span': {
			lineHeight: 1,
		},
	},

	userInfoSkeleton: {
		minWidth: '200px',
		display: 'grid',
		maxHeight: theme.spacing(4),
		marginRight: theme.spacing(0.5),

		'& span': {
			lineHeight: 1,
		},
	},

	userAvatar: {
		width: `${theme.spacing(4)} !important`,
		height: `${theme.spacing(4)} !important`,
		marginRight: theme.spacing(1),
	},
}));

export default useAppLayoutStyles;
