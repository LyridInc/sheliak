import { gql } from '@apollo/client';

const GET_ACCOUNT_STATISTICS = gql`
	query getAccountStatistics {
		accountStatistics {
			total
			verified
			unverified
			deactivated
			superuser
			staff
			neverLogin
			last90Days {
				total
				verified
			}
			last7DaysTrends {
				percentTotal
				percentVerified
			}
		}
	}
`;
// "[\"2021-10-09\",\"2021-10-21\"]"
const GET_LOGIN_STATISTICS = gql`
	query getLoginStatistics($dateRange: String!) {
		loginStatistics(dateRange: $dateRange, first: 100) {
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
			edges {
				node {
					date
					total
					unique
					github
					google
					facebook
					django
				}
			}
		}
	}
`;

export const DashboardQuery = {
	GET_ACCOUNT_STATISTICS,
	GET_LOGIN_STATISTICS,
};
