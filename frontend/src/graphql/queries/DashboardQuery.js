import { gql } from '@apollo/client';

const GET_ACCOUNT_STATISTICS = gql`
	query getAccountStatistics($dateStart: Date!, $dateEnd: Date!) {
		accountStatistics(dateStart: $dateStart, dateEnd: $dateEnd) {
			total
			verified
			unverified
			deactivated
			superuser
			staff
			neverLogin
			activeUsers
			lastXDays {
				total
				verified
				activeUsers
			}
			trendsInPercent {
				percentageChangeJoined
				percentageChangeVerified
				percentageChangeLogins
			}
			top10Logins {
				user {
					pk
					email
					fullName
					isSuperuser
				}
				logins
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

const GET_USER_GROWTH_STATISTICS = gql`
	query getUserGrowthStatistics($dateStart: Date!, $dateEnd: Date!) {
		userGrowthStatistics(dateStart: $dateStart, dateEnd: $dateEnd) {
			date
			totalUsers
			totalVerifiedUsers
			totalUnverifiedUsers
			newUsers
			newVerifiedUsers
			newUnverifiedUsers
		}
	}
`;

export const DashboardQuery = {
	GET_ACCOUNT_STATISTICS,
	GET_LOGIN_STATISTICS,
	GET_USER_GROWTH_STATISTICS,
};
