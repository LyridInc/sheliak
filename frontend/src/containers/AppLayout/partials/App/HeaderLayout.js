import React, { useContext } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Avatar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';

import { LOGO } from 'assets/images';
import Drawer from 'components/Drawer';
import SideNav from 'containers/SideNav';
import { AuthQuery } from 'graphql/queries';
import AppContext from 'helpers/ContextProvider/AppContext';
import UserInfoSkeleton from 'components/Loaders/userInfo';
import useAppLayoutStyles from 'assets/styles/Containers/AppLayoutStyles';

const HeaderLayout = ({ open, setOpen }) => {
	const classes = useAppLayoutStyles();
	const { logout } = useContext(AppContext);
	const { data: me, loading } = useQuery(AuthQuery.GET_ME_USER);
	const fullName = _.get(me, 'me.fullName', '');
	const email = _.get(me, 'me.email', '');

	const handleLogout = () => {
		logout();
	};

	const handleDrawerToggle = () => {
		setOpen(!open);
	};

	return (
		<>
			<AppBar className={classes.appBar}>
				<Toolbar variant="dense">
					<IconButton edge="start" color="primary" aria-label="menu" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Box className={classes.appLogo}>
						<img src={LOGO.default} alt="" />
					</Box>

					<Box sx={{ flexGrow: 1 }} />

					<Box className={classes.userBox}>
						{loading ? (
							<Box className={classes.userInfoSkeleton}>
								<UserInfoSkeleton />
							</Box>
						) : (
							<>
								<Box className={classes.userInfo}>
									<Typography component="span" variant="h6">
										{fullName}
									</Typography>
									<Typography component="span" variant="caption" color="gray">
										{email}
									</Typography>
								</Box>
								<Avatar className={classes.userAvatar} alt={fullName} src={`#/jhdkjhdk`} />
							</>
						)}
					</Box>

					<Tooltip title="Logout" arrow>
						<IconButton edge="end" color="primary" onClick={handleLogout}>
							<LogoutIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>

			<Drawer open={open} variant="permanent">
				<Toolbar variant="dense" />
				<SideNav mini={!open} />
			</Drawer>
		</>
	);
};

HeaderLayout.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};

export default HeaderLayout;
