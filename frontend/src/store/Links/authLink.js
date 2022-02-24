import { ApolloLink } from '@apollo/client';
import { AuthConstant } from 'constants/index';

const authLink = new ApolloLink((operation, forward) => {
	const tokenJWT = localStorage.getItem(AuthConstant.AUTH_TOKEN);

	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			Authorization: tokenJWT ? `Bearer ${tokenJWT}` : '',
		},
	}));
	return forward(operation);
});

export default authLink;
