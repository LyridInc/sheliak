import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Toolbar } from '@mui/material';

import useAppLayoutStyles from 'assets/styles/Containers/AppLayoutStyles';
import HeaderLayout from 'containers/AppLayout/partials/App/HeaderLayout';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const AppContainer = ({ children }) => {
	const [open, setOpen] = useState(false);
	const classes = useAppLayoutStyles({ open });

	return (
		<Box className={classes.appBox}>
			<HeaderLayout open={open} setOpen={setOpen} />
			<Box component={Paper} className={classes.mainBox}>
				<Toolbar variant="dense" />
				{children}
			</Box>
		</Box>
	);
};

AppContainer.propTypes = {
	children: PropTypes.any,
};

export default AppContainer;
