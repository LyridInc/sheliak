import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import useAppLayoutStyles from 'assets/styles/Containers/AppLayoutStyles';

const LandingContainer = ({ children }) => {
	const classes = useAppLayoutStyles();

	return <Box className={classes.landingBox}>{children}</Box>;
};

LandingContainer.propTypes = {
	children: PropTypes.any,
};

export default LandingContainer;
