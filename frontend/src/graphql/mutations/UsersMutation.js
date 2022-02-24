import { gql } from '@apollo/client';

const CHANGE_PASSWORD = gql`
	mutation PasswordSetStaff($userId: ID!, $newPassword1: String!, $newPassword2: String!) {
		passwordSetAdmin(id: $userId, newPassword1: $newPassword1, newPassword2: $newPassword2) {
			errors
			success
		}
	}
`;

const REGIS_ADMIN = gql`
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
				email
				firstName
				id
				isStaff
				isSuperuser
				isActive
				lastName
				mobileNumber
				profile {
					id
					gender
					dateOfBirth
					timezone
					created
					modified
					picture
					nationality
					address
					inviteCode
					company
					legacyId
				}
			}
		}
	}
`;

export const UsersMutation = {
	CHANGE_PASSWORD,
	REGIS_ADMIN,
};
