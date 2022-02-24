import { gql } from '@apollo/client';

const GET_IS_LOGGED_IN = gql`
	query GetIsLoggedIn {
		isLoggedIn @client
	}
`;

const GET_ME_USER = gql`
	query GetMEUser {
		me {
			email
			firstName
			fullName
			id
			lastName
			mobileNumber
		}
	}
`;

export const AuthQuery = {
	GET_IS_LOGGED_IN,
	GET_ME_USER,
};
