import React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';

import { URLConstant } from 'constants/index';
import Navigation from 'components/Navigation';

const SideNav = ({ mini }) => {
	const navigationMenus = [
		{
			name: 'Dashboard',
			icon: <DashboardIcon />,
			link: URLConstant.DASHBOARD,
			subject: 'Dashboard',
		},
		{
			name: 'User Management',
			icon: <PeopleAltIcon />,
			link: URLConstant.USERS,
			subject: 'UserManagement',
		},
		{
			name: 'Settings',
			icon: <SettingsIcon />,
			link: URLConstant.SETTINGS,
			subject: 'Settings',
		},
	];

	return <Navigation menuItems={navigationMenus} mini={mini} />;
};

SideNav.propTypes = {
	mini: PropTypes.bool,
};

export default SideNav;
