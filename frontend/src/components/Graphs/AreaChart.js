import React from 'react';
import PropTypes from 'prop-types';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const AreaChartCustom = (props) => {
	const { data, width, height, unit, yAxisDomain, handleXAxisTickFormat, handleTooltipValue, handleTooltipLabel } = props;

	return (
		<AreaChart data={data[0].data} width={width} height={height} margin={{ right: 10 }}>
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
			<defs>
				<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#4258BC" stopOpacity={1} />
					<stop offset="95%" stopColor="#FFF" stopOpacity={0.8} />
				</linearGradient>
			</defs>

			<Area
				type="monotone"
				dataKey="value"
				strokeWidth={2}
				stroke="#673ab7"
				fill="url(#gradient)"
				isAnimationActive={false}
			/>
		</AreaChart>
	);
};

AreaChartCustom.propTypes = {
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

export default AreaChartCustom;
