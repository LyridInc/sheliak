import jwtDecode from 'jwt-decode';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { AuthConstant } from 'constants/index';
import { ApolloClient, createHttpLink } from '@apollo/client';

import cache from '../cache';
import logger from 'helpers/Utils/loggerHelper';
import { AuthMutation } from 'graphql/mutations';
import { isLoggedInVar } from 'store/cache';

const JWTClient = new ApolloClient({
	link: createHttpLink({ uri: process.env.REACT_APP_BACKEND_ENGINE_HTTP }),
	cache,
	credentials: 'include',
});

const revokeTokenAndLogout = () => {
	const oldRefreshToken = localStorage.getItem(AuthConstant.AUTH_TOKEN_REFRESH);
	if (oldRefreshToken) {
		JWTClient.mutate({
			mutation: AuthMutation.REVOKE_REFRESH_TOKEN,
			variables: {
				refreshToken: localStorage.getItem(AuthConstant.AUTH_TOKEN_REFRESH),
			},
		});
	}

	localStorage.removeItem(AuthConstant.AUTH_TOKEN);
	localStorage.removeItem(AuthConstant.AUTH_TOKEN_REFRESH);
	isLoggedInVar(false);
};

const refreshTokenLink = new TokenRefreshLink({
	accessTokenField: 'refreshToken',
	isTokenValidOrUndefined: () => {
		const token = localStorage.getItem(AuthConstant.AUTH_TOKEN);
		if (!token) return true;

		try {
			const { exp } = jwtDecode(token);
			return Date.now() / 1000 < exp;
		} catch {
			return false;
		}
	},
	fetchAccessToken: async () => {
		const { data } = await JWTClient.mutate({
			mutation: AuthMutation.REFRESH_TOKEN,
			variables: {
				refreshToken: localStorage.getItem(AuthConstant.AUTH_TOKEN_REFRESH),
			},
		});
		return data;
	},
	handleFetch: (newTokens) => {
		const { token, refreshToken } = newTokens;

		// The following if condition will met only if -
		// 1. oldRefresh token has been expired or revoked.
		// 2. The graphql endpoint has some issues.
		// In any case logout the user.
		if (!token || !refreshToken) {
			return revokeTokenAndLogout();
		}

		localStorage.setItem(AuthConstant.AUTH_TOKEN, token);
		localStorage.setItem(AuthConstant.AUTH_TOKEN_REFRESH, refreshToken);
	},
	handleResponse: () => (response) => {
		return response;
	},
	handleError: (err) => {
		logger.logger('[TokenRefreshLinkError]: ' + err);
		return revokeTokenAndLogout();
	},
});

export default refreshTokenLink;
