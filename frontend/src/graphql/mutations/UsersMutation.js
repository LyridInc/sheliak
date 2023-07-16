import { gql } from '@apollo/client';
import { Fragments } from 'graphql/fragments';

const USER_CHANGE_PASSWORD_ADMIN = gql`
	mutation PasswordSetStaff($userId: ID!, $newPassword1: String!, $newPassword2: String!) {
		passwordSetAdmin(id: $userId, newPassword1: $newPassword1, newPassword2: $newPassword2) {
			errors
			success
		}
	}
`;

const USER_REGISTRATION_ADMIN = gql`
	${Fragments.USER_ADMIN_FIELDS_FRAGMENT}
	mutation registerAdmin(
		$email: String!
		$password: String!
		$mobileNumber: String!
		$firstName: String!
		$isActive: Boolean!
		$isStaff: Boolean!
		$isSuperuser: Boolean!
	) {
		registerAdmin(
			input: {
				email: $email
				mobileNumber: $mobileNumber
				firstName: $firstName
				password: $password
				isActive: $isActive
				isStaff: $isStaff
				isSuperuser: $isSuperuser
			}
		) {
			success
			errors
			user {
				...UserFields
			}
		}
	}
`;

const USER_TOGGLE_ACTIVATION_ADMIN = gql`
	${Fragments.USER_ADMIN_FIELDS_FRAGMENT}
	mutation updateAccountAdmin($id: ID!, $isActive: Boolean!) {
		updateAccountAdmin(id: $id, input: { isActive: $isActive }) {
			success
			errors
			user {
				...UserFields
			}
		}
	}
`;

const USER_UPDATE_ACCOUNT_ADMIN = gql`
	${Fragments.USER_ADMIN_FIELDS_FRAGMENT}
	mutation updateAccountAdmin($id: ID!, $input: UpdateUserInputStaff!) {
		updateAccountAdmin(id: $id, input: $input) {
			success
			errors
			user {
				...UserFields
			}
		}
	}
`;

export const UsersMutation = {
	USER_CHANGE_PASSWORD_ADMIN,
	USER_REGISTRATION_ADMIN,
	USER_TOGGLE_ACTIVATION_ADMIN,
	USER_UPDATE_ACCOUNT_ADMIN,
};
