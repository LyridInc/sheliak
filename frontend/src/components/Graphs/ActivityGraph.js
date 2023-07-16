import React, { useState } from 'react';
import { deepPurple } from '@mui/material/colors';
import PropTypes from 'prop-types';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Typography } from '@mui/material';

import ClickableLegend from 'components/Graphs/ClickableLegend';

const ActivityGraph = ({ data }) => {
	const [unselected, setUnselected] = useState({});

	const handleLegendClick = (entry) => {
		setUnselected({
			...unselected,
			[entry.value]: !unselected[entry.value],
		});
	};

	const getSocialValue = (d) => {
		return d.node.facebook + d.node.github + d.node.google;
	};

	const labelFormatter = (label) => {
		return (
			<Typography component="span" sx={{ color: '#003f5c' }}>
				Date:{' '}
				<Typography component="span" fontWeight={'bold'}>
					{label}
				</Typography>
			</Typography>
		);
	};

	return (
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={data.edges} margin={{ right: 10 }}>
				<Tooltip
					labelStyle={{ color: 'black' }}
					itemStyle={{ color: deepPurple[700], padding: 1 }}
					labelFormatter={labelFormatter}
					cursor={false}
				/>

				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="node.date" minTickGap={10} tickMargin={5} />

				<YAxis />
				<Legend onClick={handleLegendClick} />
				<Legend content={(props) => <ClickableLegend {...props} onClick={handleLegendClick} {...unselected} />} />
				<Line
					type="monotone"
					dataKey="node.total"
					stroke="#0000FF"
					strokeWidth={2}
					name="Total logins"
					dot={false}
					hide={unselected['Total logins']}
				/>
				<Line
					type="monotone"
					dataKey="node.unique"
					stroke="#009D00"
					strokeWidth={2}
					dot={false}
					hide={unselected['Unique logins']}
					name="Unique logins"
				/>
				<Line
					type="monotone"
					dataKey={getSocialValue}
					stroke="#FF0000"
					strokeWidth={2}
					dot={false}
					hide={unselected['Social logins']}
					name="Social logins"
				/>
				<Line
					type="monotone"
					dataKey="node.django"
					stroke="#8989FF"
					strokeWidth={2}
					dot={false}
					hide={unselected['Local logins']}
					name="Local logins"
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

ActivityGraph.propTypes = {
	data: PropTypes.object,
};

export default ActivityGraph;
