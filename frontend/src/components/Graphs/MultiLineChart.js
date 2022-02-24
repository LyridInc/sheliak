// import React, { useEffect, useState } from 'react';
// import _ from 'lodash';
// import PropTypes from 'prop-types';
// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
// import { randomColor } from 'helpers/Utils/commonHelper';
//
// const MultiLineChart = (props) => {
// 	const { data, width, height, unit, yAxisDomain, handleXAxisTickFormat, handleTooltipValue, handleTooltipLabel } = props;
//
// 	const [colors, setColors] = useState([]);
//
// 	useEffect(() => {
// 		setColors(_.map(data, randomColor));
// 	}, []);
//
// 	const handleLegendToggle = () => {
// 		// DO Nothing for Now
// 		// console.log(event);
// 	};
//
// 	return (
// 		<LineChart width={width} height={height} margin={{ right: 10 }}>
// 			<XAxis
// 				dataKey="time"
// 				domain={['auto', 'auto']}
// 				scale="time"
// 				type="number"
// 				minTickGap={10}
// 				tickMargin={5}
// 				tickFormatter={handleXAxisTickFormat}
// 			/>
//
// 			<YAxis dataKey="value" domain={yAxisDomain} unit={unit} />
//
// 			<CartesianGrid strokeDasharray="0" stroke="#DCDEDE" />
//
// 			<Tooltip formatter={handleTooltipValue} labelFormatter={handleTooltipLabel} />
// 			<Legend verticalAlign="top" height={60} align="right" iconType="triangle" onClick={handleLegendToggle} />
// 			{_.map(data, (s, i) => (
// 				<Line
// 					dataKey={s.visible ? 'value' : ''}
// 					type="monotone"
// 					data={s.data}
// 					name={s.name}
// 					key={s.name}
// 					stroke={colors[i]}
// 					dot={false}
// 				/>
// 			))}
// 		</LineChart>
// 	);
// };
//
// MultiLineChart.propTypes = {
// 	data: PropTypes.array,
// 	width: PropTypes.number,
// 	height: PropTypes.number,
// 	unit: PropTypes.string,
// 	yAxisDomain: PropTypes.array,
// 	handleXAxisTickFormat: PropTypes.func,
// 	handleYAxisTickFormat: PropTypes.func,
// 	handleTooltipValue: PropTypes.func,
// 	handleTooltipLabel: PropTypes.func,
// };
//
// export default MultiLineChart;
