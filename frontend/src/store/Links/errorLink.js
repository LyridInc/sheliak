import React from 'react';
import _ from 'lodash';
import { onError } from '@apollo/client/link/error';

import IntlMessages from 'helpers/Utils/IntlMessages';

let useToastsHook;

export function setUseToastsHook(useToastHookInstance) {
	useToastsHook = useToastHookInstance;
}

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
	const { addToast } = useToastsHook;

	if (graphQLErrors)
		graphQLErrors.map(({ message, path }) => {
			// exclude geolocation errors
			if (!_.includes(['geoIpLocation'], path.toString())) {
				addToast(message.toString(), { appearance: 'error' });
			}
		});
	if (networkError) {
		addToast(<IntlMessages id={'errors.network'} />, { appearance: 'error' });
	}
});

// Backend (django) exceptions handler
const formatErrors = (data) => {
	const errors = data['errors'];
	const nonFieldErrors = errors['nonFieldErrors'];
	let msg = '';

	if (!_.isEmpty(nonFieldErrors)) {
		msg = _.map(nonFieldErrors, 'message').join(' ');
	} else if (!_.isEmpty(errors)) {
		_.forEach(errors, (value, key) => {
			const joinedMessage = _.map(value, 'message').join(' ');
			if (joinedMessage === '') {
				msg += key + ' - ' + value.message;
			} else {
				msg += key + ' - ' + joinedMessage;
			}
		});
	} else {
		msg = <IntlMessages id={'errors.general'} />;
	}
	return msg;
};

export const errorHandler = (data) => {
	const { addToast } = useToastsHook;
	if (!_.isEmpty(data['errors'])) return addToast(formatErrors(data), { appearance: 'error' });
	return addToast(data['message'], { appearance: 'error' });
};

export default errorLink;
