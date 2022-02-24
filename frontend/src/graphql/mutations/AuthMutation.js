import { gql } from '@apollo/client';

const LOGIN = gql`
	mutation tokenAuth($email: String!, $password: String!) {
		tokenAuth(email: $email, password: $password) {
			success
			errors
			token
			refreshToken
			user {
				id
				email
				verified
				isStaff
				isActive
			}
		}
	}
`;

// const SOCIAL_LOGIN = gql`
// 	mutation socialAuth($accessToken: String!, $provider: String!) {
// 		socialAuth(accessToken: $accessToken, provider: $provider) {
// 			token
// 			errors
// 			success
// 			refreshToken
// 		}
// 	}
// `;

const REFRESH_TOKEN = gql`
	mutation RefreshTokenMutation($refreshToken: String!) {
		refreshToken(refreshToken: $refreshToken) {
			token
			errors
			success
			refreshToken
		}
	}
`;

const REVOKE_REFRESH_TOKEN = gql`
	mutation revokeToken($refreshToken: String!) {
		revokeToken(refreshToken: $refreshToken) {
			revoked
		}
	}
`;

const SEND_PASSWORD_RESET_MAIL = gql`
	mutation sendPasswordResetMutation($email: String!) {
		sendPasswordResetEmail(email: $email) {
			success
			errors
		}
	}
`;

const PASSWORD_RESET = gql`
	mutation passwordReset($token: String!, $newPassword1: String!, $newPassword2: String!) {
		passwordReset(token: $token, newPassword1: $newPassword1, newPassword2: $newPassword2) {
			success
			errors
		}
	}
`;

export const AuthMutation = {
	LOGIN,
	// SOCIAL_LOGIN,
	REFRESH_TOKEN,
	REVOKE_REFRESH_TOKEN,

	SEND_PASSWORD_RESET_MAIL,
	PASSWORD_RESET,
};
