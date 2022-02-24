import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Box, Typography } from '@mui/material';

const TableTitle = ({ title, loading }) => {
	return (
		<Box sx={{ display: 'flex' }}>
			<Typography variant="h6" component="span">
				{title}
			</Typography>

			{loading && (
				<Box ml={1} sx={{ display: 'flex', alignItems: 'center' }}>
					<CircularProgress size={20} color="inherit" />
				</Box>
			)}
		</Box>
	);
};

TableTitle.propTypes = {
	title: PropTypes.string,
	loading: PropTypes.bool,
};

export default TableTitle;
