import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';

import { URLConstant } from 'constants/index';
import IntlMessages from 'helpers/Utils/IntlMessages';
import useErrorStyles from 'assets/styles/Pages/ErrorStyles';

const Error404 = () => {
	const classes = useErrorStyles();

	return (
		<Box className={classes.errorBox}>
			<Typography className={classes.title}>
				<IntlMessages id={'errors.404.title'} />
			</Typography>

			<Typography className={classes.subtitle}>
				<IntlMessages id={'errors.404.subtitle'} />
			</Typography>

			<Typography variant="caption">
				<IntlMessages id={'errors.404.caption'} /> &nbsp;
				<Link component={RouterLink} to={URLConstant.DASHBOARD}>
					<IntlMessages id={'common.goBack'} />
				</Link>
			</Typography>
		</Box>
	);
};

export default Error404;
