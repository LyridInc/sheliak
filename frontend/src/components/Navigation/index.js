import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import { List, ListItemIcon, ListItemText, Typography } from '@mui/material';

import NavListItem from './NavItem';
import MenuTooltip from './MenuTooltip';
import useNavigationStyles from 'assets/styles/Components/NavigationStyles';

const Navigation = (props) => {
	const { menuItems, mini } = props;
	const location = useLocation();
	const classes = useNavigationStyles();

	return (
		<List component="nav" disablePadding className={classes.sideNavMenu}>
			{menuItems.map((item, index) =>
				mini ? (
					<MenuTooltip
						key={index}
						name={item.name}
						placement="right"
						title={
							<React.Fragment>
								<Typography color="inherit">{item.name}</Typography>
							</React.Fragment>
						}>
						<NavListItem button component={Link} key={index} to={item.link} selected={item.link === location.pathname}>
							<ListItemIcon className={classes.icon}>{item.icon}</ListItemIcon>
							<ListItemText primary={item.name} />
						</NavListItem>
					</MenuTooltip>
				) : (
					<NavListItem button component={Link} key={index} to={item.link} selected={item.link === location.pathname}>
						<ListItemIcon className={classes.icon}>{item.icon}</ListItemIcon>
						<ListItemText primary={item.name} />
					</NavListItem>
				),
			)}
		</List>
	);
};

Navigation.propTypes = {
	menuItems: PropTypes.any,
	mini: PropTypes.bool,
};

export default Navigation;
