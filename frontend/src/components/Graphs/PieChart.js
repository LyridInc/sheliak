import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Pie, Cell, PieChart, Tooltip } from 'recharts';

import { randomColor } from 'helpers/Utils/commonHelper';

const PieChartCustom = (props) => {
	const { data, width, height, handleTooltipValue, handleTooltipLabel } = props;

	const [chartData, setChartData] = useState([]);
	const [colors, setColors] = useState([]);

	useEffect(() => {
		setChartData(
			_.map(data[0].data.slice(0, 10), (point) => {
				return _.mapValues(point, function (value) {
					return parseFloat(value);
				});
			}),
		);
	}, [data]);

	useEffect(() => {
		setColors(_.map(chartData, randomColor));
	}, [chartData]);

	return (
		<PieChart width={width} height={height}>
			<Tooltip formatter={handleTooltipValue} labelFormatter={handleTooltipLabel} />
			<Pie
				data={chartData}
				dataKey="value"
				nameKey="time"
				cx="50%"
				cy="50%"
				outerRadius={100}
				fill="#673ab7"
				isAnimationActive={true}>
				{_.map(chartData, (s, i) => {
					return <Cell key={i} fill={colors[i]} />;
				})}
			</Pie>
		</PieChart>
	);
};

PieChartCustom.propTypes = {
	data: PropTypes.array,
	width: PropTypes.number,
	height: PropTypes.number,
	handleTooltipValue: PropTypes.func,
	handleTooltipLabel: PropTypes.func,
};

export default PieChartCustom;
