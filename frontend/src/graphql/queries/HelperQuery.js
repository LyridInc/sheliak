import { gql } from '@apollo/client';

const GET_NATIONALITIES = gql`
	query getNationalities {
		allNationalities {
			value
			label
		}
	}
`;

const GET_TIMEZONES = gql`
	query getTimezones {
		allTimezones {
			value
			label
		}
	}
`;

export const HelperQuery = {
	GET_NATIONALITIES,
	GET_TIMEZONES,
};
