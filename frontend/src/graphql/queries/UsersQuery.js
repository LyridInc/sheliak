import { gql } from '@apollo/client';

const GET_USERS = gql`
	query GetUsers($first: Int!, $offset: Int!, $orderBy: [String], $isActive: Boolean, $isStaff: Boolean, $search: String) {
		users(first: $first, offset: $offset, orderBy: $orderBy, isActive: $isActive, isStaff: $isStaff, search: $search) {
			totalCount
			edgeCount
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
			edges {
				node {
					email
					firstName
					isStaff
					isActive
					dateJoined
					lastLogin
					pk
					id
				}
			}
		}
	}
`;

const GET_USER = gql`
	query GetUser($id: ID!) {
		user(id: $id) {
			id
			pk
			email
			firstName
			middleName
			lastName
			fullName
			isStaff
			isActive
			isSuperuser
			mobileNumber
			profile {
				id
				gender
				picture
				dateOfBirth
				nationality
				timezone
				address
				inviteCode
				company
				legacyId
				extraInfo
				created
				modified
			}
		}
	}
`;

export const UsersQuery = {
	GET_USERS,
	GET_USER,
};
