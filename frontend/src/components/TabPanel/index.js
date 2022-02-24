import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}>
			{value === index && <Box px={3}>{children}</Box>}
		</div>
	);
};

TabPanel.propTypes = {
	children: PropTypes.any,
	value: PropTypes.any,
	index: PropTypes.number,
};

export default TabPanel;
