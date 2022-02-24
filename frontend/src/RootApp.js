import React, { useContext, Suspense } from 'react';
import { IntlProvider } from 'react-intl';
import * as Sentry from '@sentry/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import AppLocale from 'i18n';
import App from 'containers/App';
import AppLayout from 'containers/AppLayout';
import AppContext from 'helpers/ContextProvider/AppContext';
import { SheliakToastContainer } from 'components/Toast/ToastContainer';
import ErrorFallback from 'components/Pages/ErrorFallback';
import PageLoader from 'components/Pages/PageLoader';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const RootApp = () => {
	const { locale } = useContext(AppContext);
	const currentAppLocale = AppLocale[locale.locale];

	return (
		<IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
			<ToastProvider autoDismiss components={{ ToastContainer: SheliakToastContainer }}>
				<Router>
					<AppLayout>
						<Suspense fallback={<PageLoader />}>
							<Sentry.ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
								<Switch>
									<Route path="/" component={App} />
								</Switch>
							</Sentry.ErrorBoundary>
						</Suspense>
					</AppLayout>
				</Router>
			</ToastProvider>
		</IntlProvider>
	);
};

export default RootApp;
