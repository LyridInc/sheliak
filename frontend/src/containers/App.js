import React, { lazy } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Redirect, Route, Switch } from 'react-router';
import { useLocation, useRouteMatch } from 'react-router-dom';

import Routes from 'routes';
import { URLConstant } from '../constants';
import { isLoggedInVar } from 'store/cache';
import AuthContainer from 'containers/Auth';
import { isAuthURL } from 'helpers/Utils/commonHelper';
import RestrictedRoute from 'helpers/RestrictedRoute';

const App = () => {
	const isLoggedIn = useReactiveVar(isLoggedInVar);
	const location = useLocation();
	const match = useRouteMatch();

	if (isLoggedIn && (location.pathname === '' || location.pathname === '/' || isAuthURL(location.pathname))) {
		return <Redirect to={URLConstant.DASHBOARD} />;
	}

	if (!isLoggedIn && !isAuthURL(location.pathname)) {
		return <Redirect to={URLConstant.LOGIN} />;
	}

	const Error404 = lazy(() => import('components/Pages/404'));
	return (
		<React.Fragment>
			<Switch>
				<RestrictedRoute path={`${match.url}app`} component={Routes} />
				<Route path={URLConstant.LOGIN} component={AuthContainer} />
				<Route component={Error404} />
			</Switch>
		</React.Fragment>
	);
};

export default App;
