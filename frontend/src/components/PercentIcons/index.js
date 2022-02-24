import React from 'react';
import PropTypes from 'prop-types';
import { Chip, Box, Typography } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { deepPurple } from '@mui/material/colors';

const PercentIcons = ({ value, tooltip }) => {
	return (
		<Box component="div" color={value > 0 ? '#8DCD03' : value < 0 ? '#E00930' : deepPurple[500]} sx={{ textAlign: 'end' }}>
			<Typography variant="h3" fontWeight={'lighter'}>
				{value}% {value > 0 ? <TrendingUpIcon /> : value < 0 ? <TrendingDownIcon /> : <TrendingFlatIcon />}
			</Typography>
			<Chip size={'small'} color={'primary'} sx={{ borderRadius: 1 }} label={tooltip} />
		</Box>
	);
};

PercentIcons.propTypes = {
	value: PropTypes.any,
	tooltip: PropTypes.string,
};

export default PercentIcons;
