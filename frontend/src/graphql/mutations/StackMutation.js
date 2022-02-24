import { gql } from '@apollo/client';

const CREATE_STACK = gql`
	mutation CreateStack(
		$siteTitle: String!
		$fromEmail: String!
		$backend: EmailBackend!
		$failSilently: Boolean!
		$awsAccessKeyId: String
		$awsSecretAccessKey: String
		$awsSesRegionEndpoint: String
		$awsSesRegionName: String
		$awsSesAutoThrottle: Decimal
		$awsSesConfig: String
		$dkimDomain: String
		$dkimKey: String
		$dkimSelector: String
		$dkimHeaders: String
		$awsSesSourceArn: String
		$awsSesFromArn: String
		$awsSesReturnPathArn: String
		$host: String
		$port: Int
		$username: String
		$password: String
		$useTls: Boolean
		$useSsl: Boolean
		$timeout: Int
	) {
		createStack(
			input: {
				siteTitle: $siteTitle
				email: {
					backend: $backend
					fromEmail: $fromEmail
					failSilently: $failSilently
					awsAccessKeyId: $awsAccessKeyId
					awsSecretAccessKey: $awsSecretAccessKey
					awsSesRegionEndpoint: $awsSesRegionEndpoint
					awsSesRegionName: $awsSesRegionName
					awsSesAutoThrottle: $awsSesAutoThrottle
					awsSesConfig: $awsSesConfig
					dkimDomain: $dkimDomain
					dkimKey: $dkimKey
					dkimSelector: $dkimSelector
					dkimHeaders: $dkimHeaders
					awsSesSourceArn: $awsSesSourceArn
					awsSesFromArn: $awsSesFromArn
					awsSesReturnPathArn: $awsSesReturnPathArn
					host: $host
					port: $port
					username: $username
					password: $password
					useTls: $useTls
					useSsl: $useSsl
					timeout: $timeout
				}
			}
		) {
			errors
			success
			stack {
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
`;

const PATCH_STACK = gql`
	mutation CreateStack(
		$id: ID!
		$siteTitle: String!
		$fromEmail: String!
		$backend: EmailBackend!
		$failSilently: Boolean!
		$awsAccessKeyId: String
		$awsSecretAccessKey: String
		$awsSesRegionEndpoint: String
		$awsSesRegionName: String
		$awsSesAutoThrottle: Decimal
		$awsSesConfig: String
		$dkimDomain: String
		$dkimKey: String
		$dkimSelector: String
		$dkimHeaders: String
		$awsSesSourceArn: String
		$awsSesFromArn: String
		$awsSesReturnPathArn: String
		$host: String
		$port: Int
		$username: String
		$password: String
		$useTls: Boolean
		$useSsl: Boolean
		$timeout: Int
	) {
		patchStack(
			id: $id
			input: {
				siteTitle: $siteTitle
				email: {
					backend: $backend
					fromEmail: $fromEmail
					failSilently: $failSilently
					awsAccessKeyId: $awsAccessKeyId
					awsSecretAccessKey: $awsSecretAccessKey
					awsSesRegionEndpoint: $awsSesRegionEndpoint
					awsSesRegionName: $awsSesRegionName
					awsSesAutoThrottle: $awsSesAutoThrottle
					awsSesConfig: $awsSesConfig
					dkimDomain: $dkimDomain
					dkimKey: $dkimKey
					dkimSelector: $dkimSelector
					dkimHeaders: $dkimHeaders
					awsSesSourceArn: $awsSesSourceArn
					awsSesFromArn: $awsSesFromArn
					awsSesReturnPathArn: $awsSesReturnPathArn
					host: $host
					port: $port
					username: $username
					password: $password
					useTls: $useTls
					useSsl: $useSsl
					timeout: $timeout
				}
			}
		) {
			errors
			success
			stack {
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
`;

export const StackMutation = {
	CREATE_STACK,
	PATCH_STACK,
};
