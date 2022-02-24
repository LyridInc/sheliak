import { gql } from '@apollo/client';

const GET_STACKS = gql`
	query GetStacks($first: Int!, $offset: Int!) {
		stacks(first: $first, offset: $offset) {
			totalCount
			edgeCount
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
			edges {
				cursor
				node {
					id
					siteTitle
					created
					modified
					email {
						backend
						fromEmail
						failSilently
						awsAccessKeyId
						awsSecretAccessKey
						awsSesRegionEndpoint
						awsSesRegionName
						awsSesAutoThrottle
						awsSesConfig
						dkimDomain
						dkimKey
						dkimSelector
						dkimHeaders
						awsSesSourceArn
						awsSesFromArn
						awsSesReturnPathArn
						host
						port
						username
						password
						useTls
						useSsl
						timeout
					}
				}
			}
		}
	}
`;

export const StackQuery = {
	GET_STACKS,
};
