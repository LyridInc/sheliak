import { gql } from '@apollo/client';

const USER_ADMIN_FIELDS_FRAGMENT = gql`
	fragment UserFields on UserAdminType {
		id
		email
		firstName
		middleName
		lastName
		dateJoined
		isStaff
		isSuperuser
		isActive
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
			extraInfo
		}
	}
`;

export const Fragments = {
	USER_ADMIN_FIELDS_FRAGMENT,
};
