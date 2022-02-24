import React from 'react';
import PropTypes from 'prop-types';
import { DefaultToastContainer } from 'react-toast-notifications';

export const SheliakToastContainer = ({ children, ...props }) => (
	<DefaultToastContainer {...props} style={{ zIndex: 9999 }}>
		{children}
	</DefaultToastContainer>
);

SheliakToastContainer.propTypes = {
	children: PropTypes.any,
};
