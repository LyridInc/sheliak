import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

import AppContext from './AppContext';
import defaultContext from './defaultContext';
import { AuthConstant } from 'constants/index';
import { AuthMutation } from 'graphql/mutations';
import { isLoggedInVar } from 'store/cache';

const AppContextProvider = ({ children }) => {
	const [theme, updateTheme] = useState(defaultContext.theme);
	const [locale, updateLocale] = useState(defaultContext.defaultLng);
	const [revokeToken, { client }] = useMutation(AuthMutation.REVOKE_REFRESH_TOKEN);

	const logout = useCallback(() => {
		const refreshToken = localStorage.getItem(AuthConstant.AUTH_TOKEN_REFRESH);
		if (refreshToken) {
			revokeToken({
				variables: {
					refreshToken: refreshToken,
				},
			});
		}
		localStorage.removeItem(AuthConstant.AUTH_TOKEN);
		localStorage.removeItem(AuthConstant.AUTH_TOKEN_REFRESH);
		isLoggedInVar(false);
		client.clearStore();
	}, [revokeToken, client]);

	return (
		<AppContext.Provider
			value={{
				theme,
				updateTheme,
				locale,
				updateLocale,
				logout,
			}}>
			{children}
		</AppContext.Provider>
	);
};

AppContextProvider.propTypes = {
	children: PropTypes.any,
};

export default AppContextProvider;
