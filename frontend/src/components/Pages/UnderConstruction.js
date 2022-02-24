import React from 'react';
// import { Link } from 'react-router-dom';
// import { CommonConstant } from 'constants/index';

class UnderConstruction extends React.Component {
	render() {
		return (
			<div className="app-wrapper page-error-container animated slideInUpTiny animation-duration-3">
				<div className="page-error-content">
					<div className="error-code mb-4 animated zoomInDown">
						<i className="zmdi zmdi-wrench zmdi-hc-fw" />
					</div>
					<h2 className="text-center fw-regular title bounceIn animation-delay-10 animated">
						This page is under construction. Please check it after some days.
					</h2>
					<p className="text-center zoomIn animation-delay-20 animated">
						{/*<Link className="btn btn-primary" to={CommonConstant.URL_HOME}>*/}
						{/*	Go Home*/}
						{/*</Link>*/}
					</p>
				</div>
			</div>
		);
	}
}

export default UnderConstruction;
