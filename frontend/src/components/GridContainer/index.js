import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

const GridContainer = ({ children, ...rest }) => {
	return (
		<Grid container spacing={2} {...rest}>
			{children}
		</Grid>
	);
};

GridContainer.propTypes = {
	children: PropTypes.any,
};

export default GridContainer;
