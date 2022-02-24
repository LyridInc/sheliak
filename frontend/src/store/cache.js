import { InMemoryCache, makeVar } from '@apollo/client';
import { AuthConstant } from '../constants';

export const isLoggedInVar = makeVar(!!localStorage.getItem(AuthConstant.AUTH_TOKEN));

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				isLoggedIn: {
					read() {
						return isLoggedInVar();
					},
				},
			},
		},
	},
});

export default cache;
