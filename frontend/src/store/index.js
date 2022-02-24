import { ApolloClient } from '@apollo/client';
import appLink from './Links';
import cache from './cache';

const apiClient = new ApolloClient({
	link: appLink,
	cache,
	credentials: 'include',
});

export default apiClient;
