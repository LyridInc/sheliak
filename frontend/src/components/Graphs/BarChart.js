import React from 'react';
import PropTypes from 'prop-types';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const BarChartCustom = (props) => {
	const { data, width, height, unit, yAxisDomain, handleXAxisTickFormat, handleTooltipValue, handleTooltipLabel } = props;

	return (
		<BarChart data={data[0].data} width={width} height={height} margin={{ right: 10 }}>
			<XAxis
				dataKey="time"
				domain={['auto', 'auto']}
				scale="time"
				type="number"
				minTickGap={10}
				tickMargin={5}
				tickFormatter={handleXAxisTickFormat}
			/>

			<YAxis domain={yAxisDomain} unit={unit} />

			<CartesianGrid strokeDasharray="0" stroke="#DCDEDE" />

			<Tooltip formatter={handleTooltipValue} labelFormatter={handleTooltipLabel} />
			<Bar dataKey="value" fill="#673ab7" isAnimationActive={false} />
		</BarChart>
	);
};

BarChartCustom.propTypes = {
	data: PropTypes.array,
	width: PropTypes.number,
	height: PropTypes.number,
	unit: PropTypes.string,
	yAxisDomain: PropTypes.array,
	handleXAxisTickFormat: PropTypes.func,
	handleYAxisTickFormat: PropTypes.func,
	handleTooltipValue: PropTypes.func,
	handleTooltipLabel: PropTypes.func,
};

export default BarChartCustom;
