import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';

const useStylesMenuTooltip = makeStyles((theme) => ({
	tooltip: {
		minWidth: 140,
		fontSize: theme.typography.pxToRem(17),
		whiteSpace: `nowrap`,
		color: '#c7d0d9',
		borderRadius: '0px',
	},
}));

const MenuTooltip = ({ children, name, ...props }) => {
	const classes = useStylesMenuTooltip();

	return (
		<Tooltip
			arrow
			disableFocusListener={!name}
			disableHoverListener={!name}
			disableTouchListener={!name}
			classes={classes}
			{...props}>
			{children}
		</Tooltip>
	);
};

MenuTooltip.propTypes = {
	children: PropTypes.any,
	name: PropTypes.string,
};

export default MenuTooltip;
