import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from 'store/cache';
import { URLConstant } from '../constants';

const RestrictedRoute = ({ component: Component, ...rest }) => {
	const isLoggedIn = useReactiveVar(isLoggedInVar);

	return (
		<Route
			{...rest}
			render={(props) =>
				isLoggedIn ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: URLConstant.LOGIN,
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

RestrictedRoute.propTypes = {
	component: PropTypes.func,
	location: PropTypes.object,
};

export default RestrictedRoute;
