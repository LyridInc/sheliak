import { withStyles } from '@mui/styles';
import ListItem from '@mui/material/ListItem';

const NavListItem = withStyles((theme) => ({
	root: {
		borderLeft: `3px solid transparent !important`,
		'&$selected': {
			borderLeftColor: `${theme.palette.primary.main} !important`,
			color: `${theme.palette.primary.main} !important`,
			'& .MuiListItemIcon-root': {
				color: `${theme.palette.primary.main} !important`,
			},
		},

		'&:hover': {
			borderLeftColor: `${theme.palette.primary.main} !important`,
			color: `${theme.palette.primary.main} !important`,
			'& .MuiListItemIcon-root': {
				color: `${theme.palette.primary.main} !important`,
			},
		},
	},
	selected: {},
}))(ListItem);

export default NavListItem;
