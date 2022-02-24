import React from 'react';
import { Box } from '@mui/material';

import UserList from './UserList';
import useUsersStyles from 'assets/styles/Containers/Users';

const Users = () => {
	const classes = useUsersStyles();

	return (
		<Box className={classes.users}>
			<UserList />
		</Box>
	);
};

export default Users;
