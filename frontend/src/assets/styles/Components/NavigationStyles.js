import makeStyles from '@mui/styles/makeStyles';

const useNavigationStyles = makeStyles((theme) => ({
	sideNavMenu: {
		position: 'relative',
	},

	icon: {
		minWidth: `${theme.spacing(5)} !important`,
	},
}));

export default useNavigationStyles;
