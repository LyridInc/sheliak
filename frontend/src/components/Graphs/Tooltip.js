// import React from 'react';
// import PropTypes from 'prop-types';
//
// const CustomTooltip = ({ active, payload, labelFormatter, tooltipValue }) => {
// 	if (active) {
// 		const values = tooltipValue(payload[1].value, payload[1].name);
//
// 		return (
// 			<div className="custom-tooltip">
// 				{labelFormatter(payload[0].value)}
// 				<p className="custom-tooltip-desc">
// 					{values[1]}: {values[0]}
// 				</p>
// 			</div>
// 		);
// 	}
//
// 	return null;
// };
//
// CustomTooltip.propTypes = {
// 	active: PropTypes.bool,
// 	payload: PropTypes.array,
// 	labelFormatter: PropTypes.func,
// 	tooltipValue: PropTypes.func,
// };
//
// export default CustomTooltip;
