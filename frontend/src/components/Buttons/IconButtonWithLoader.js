import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, CircularProgress, Tooltip } from '@mui/material';

const IconButtonWithLoader = ({ children, loader, tooltip, ...props }) => {
	return (
		<Tooltip title={tooltip}>
			{!loader ? (
				<IconButton {...props}>{children}</IconButton>
			) : (
				<IconButton {...props} disabled>
					<CircularProgress size={14} />
				</IconButton>
			)}
		</Tooltip>
	);
};

IconButtonWithLoader.propTypes = {
	children: PropTypes.any,
	tooltip: PropTypes.string,
	loader: PropTypes.bool.isRequired,
};

export default IconButtonWithLoader;
