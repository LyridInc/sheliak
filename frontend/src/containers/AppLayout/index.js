import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useToasts } from 'react-toast-notifications';
import { useReactiveVar } from '@apollo/client';

import { isLoggedInVar } from 'store/cache';
import { setUseToastsHook } from 'store/Links/errorLink';
import AppContext from 'helpers/ContextProvider/AppContext';
import defaultOverrides, { appOverrides } from 'assets/styles/defaultOverrides';
import LandingContainer from './LandingContainer';
import AppContainer from './AppContainer';

const AppLayout = ({ children }) => {
	const { theme, updateTheme } = useContext(AppContext);
	const isLoggedIn = useReactiveVar(isLoggedInVar);
	setUseToastsHook(useToasts());

	useEffect(() => {
		updateTheme({
			...theme,
			...defaultOverrides,
		});

		if (isLoggedIn) {
			updateTheme({
				...theme,
				...appOverrides,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoggedIn, updateTheme]);

	return (
		<ThemeProvider theme={createTheme(theme)}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<CssBaseline />
				{!isLoggedIn ? <LandingContainer>{children}</LandingContainer> : <AppContainer>{children}</AppContainer>}
			</LocalizationProvider>
		</ThemeProvider>
	);
};

AppLayout.propTypes = {
	children: PropTypes.any,
};

export default AppLayout;
