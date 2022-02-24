import React from 'react';
import { deepPurple } from '@mui/material/colors';
import PropTypes from 'prop-types';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Typography } from '@mui/material';

const ActivityGraph = ({ data }) => {
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
				<Legend />
				<Line
					type="monotone"
					dataKey="node.total"
					stroke="#003f5c"
					strokeWidth={2}
					name="Total logins"
					activeDot={{ r: 8 }}
				/>
				<Line type="monotone" dataKey="node.unique" stroke="#58508d" strokeWidth={2} name="Unique logins" />
				<Line type="monotone" dataKey={getSocialValue} stroke="#bc5090" strokeWidth={2} name="Social logins" />
				<Line type="monotone" dataKey="node.django" stroke="#ff6361" strokeWidth={2} name="Local logins" />
			</LineChart>
		</ResponsiveContainer>
	);
};

ActivityGraph.propTypes = {
	data: PropTypes.object,
};

export default ActivityGraph;
