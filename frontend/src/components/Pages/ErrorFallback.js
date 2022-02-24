import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';

import { URLConstant } from 'constants/index';
import IntlMessages from 'helpers/Utils/IntlMessages';
import useErrorStyles from 'assets/styles/Pages/ErrorStyles';

const ErrorFallback = ({ resetError, eventId }) => {
	const classes = useErrorStyles();

	return (
		<Box className={classes.errorBox}>
			<Typography className={classes.title}>
				<IntlMessages id={'errors.fallback.title'} />
			</Typography>

			<Typography className={classes.subtitle}>
				<IntlMessages id={'errors.fallback.subtitle'} />
			</Typography>

			<Typography variant="caption">
				<IntlMessages id={'errors.fallback.caption'} /> &nbsp;
				<Link component={RouterLink} to={URLConstant.DASHBOARD} onClick={() => resetError()}>
					<IntlMessages id={'common.goBack'} />
				</Link>
			</Typography>

			<Typography component="p" color="textSecondary" variant="caption">
				<IntlMessages id={'errors.fallback.eventId'} /> : {eventId}
			</Typography>
		</Box>
	);
};

ErrorFallback.propTypes = {
	eventId: PropTypes.string,
	resetError: PropTypes.func,
};

export default ErrorFallback;
