import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ApolloProvider } from '@apollo/client/react';

import RootApp from './RootApp';
import apiClient from './store';
import AppContextProvider from 'helpers/ContextProvider';

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_KEY,
	integrations: [new Integrations.BrowserTracing()],

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 0.1,
});

const rootEl = document.getElementById('root');

ReactDOM.render(
	<ApolloProvider client={apiClient}>
		<AppContextProvider>
			<RootApp />
		</AppContextProvider>
	</ApolloProvider>,
	rootEl,
);
