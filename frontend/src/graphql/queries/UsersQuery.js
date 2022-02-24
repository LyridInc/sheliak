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
			email
			firstName
			fullName
			id
			pk
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
`;

export const UsersQuery = {
	GET_USERS,
	GET_USER,
};
