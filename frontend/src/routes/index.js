import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import PageLoader from 'components/Pages/PageLoader';

const Routes = () => {
	const match = useRouteMatch();
	const requestedUrl = match.url.replace(/\/$/, '');

	const Dashboard = lazy(() => import('containers/Dashboard'));
	const Users = lazy(() => import('containers/Users'));
	const Settings = lazy(() => import('containers/Settings'));
	const Error404 = lazy(() => import('components/Pages/404'));
	const UserProfile = lazy(() => import('containers/Users/UserProfile'));
	const UserCreate = lazy(() => import('containers/Users/UserCreate'));

	return (
		<Suspense fallback={<PageLoader />}>
			<Switch>
				<Redirect exact from={`${requestedUrl}/`} to={`${requestedUrl}/dashboard`} />
				<Route path={`${requestedUrl}/dashboard`} component={Dashboard} />
				<Route path={`${requestedUrl}/users`} component={Users} exact />
				<Route path={`${requestedUrl}/settings`} component={Settings} />
				<Route path={`${requestedUrl}/users/:id/manage-profile`} component={UserProfile} exact />
				<Route path={`${requestedUrl}/users/create`} component={UserCreate} exact />
				<Route component={Error404} />
			</Switch>
		</Suspense>
	);
};

export default Routes;
