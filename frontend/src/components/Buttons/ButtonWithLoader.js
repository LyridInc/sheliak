import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Tooltip, Button } from '@mui/material';

const ButtonWithLoader = ({ children, loader, startIcon, tooltip, ...props }) => {
	return (
		<Tooltip title={tooltip}>
			<span>
				{!loader ? (
					<Button startIcon={startIcon} {...props}>
						{children}
					</Button>
				) : (
					<Button startIcon={<CircularProgress size={14} />} {...props} disabled>
						{children}
					</Button>
				)}
			</span>
		</Tooltip>
	);
};

ButtonWithLoader.propTypes = {
	children: PropTypes.any,
	loader: PropTypes.bool.isRequired,
	startIcon: PropTypes.any,
	tooltip: PropTypes.string,
};

export default ButtonWithLoader;
