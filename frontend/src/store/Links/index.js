import { from, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
// import { SentryLink } from 'apollo-link-sentry';
import apolloLogger from 'apollo-link-logger';

import JWTLink from './jwtLink';
import authLink from './authLink';
import errorLink from './errorLink';
import httpUploadLink from './httpUploadLink';
import wsLink from './websocketLink';

// const sentryLink = new SentryLink();

const httpWSLink = split(
	// split based on operation type
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpUploadLink,
);

// const links = [JWTLink, authLink, errorLink, sentryLink, httpWSLink];
const links = [JWTLink, authLink, errorLink, httpWSLink];

if (process.env.NODE_ENV === 'development') {
	links.unshift(apolloLogger);
}

const link = from(links);

export default link;
