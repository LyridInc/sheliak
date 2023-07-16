import React, { useState } from 'react';
import { deepPurple } from '@mui/material/colors';
import PropTypes from 'prop-types';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import ClickableLegend from 'components/Graphs/ClickableLegend';

const GrowthGraph = ({ data }) => {
	const [unselected, setUnselected] = useState({});

	const handleLegendClick = (entry) => {
		setUnselected({
			...unselected,
			[entry.value]: !unselected[entry.value],
		});
	};

	return (
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={data} margin={{ right: 10 }}>
				<Tooltip labelStyle={{ color: 'black' }} itemStyle={{ color: deepPurple[700], padding: 1 }} cursor={false} />

				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" minTickGap={10} tickMargin={5} />

				<YAxis />
				<Legend onClick={handleLegendClick} />
				<Legend content={(props) => <ClickableLegend {...props} onClick={handleLegendClick} {...unselected} />} />
				<Line
					type="monotone"
					dataKey="totalUsers"
					stroke="#0000FF"
					strokeWidth={2}
					name="Total users"
					dot={false}
					hide={unselected['Total users']}
				/>
				<Line
					type="monotone"
					dataKey="totalVerifiedUsers"
					stroke="#009D00"
					strokeWidth={2}
					name="Total Verified Users"
					dot={false}
					hide={unselected['Total Verified Users']}
				/>
				<Line
					type="monotone"
					dataKey="totalUnverifiedUsers"
					stroke="#FF0000"
					strokeWidth={2}
					name="Total Unverified Users"
					dot={false}
					hide={unselected['Total Unverified Users']}
				/>
				<Line
					type="monotone"
					dataKey="newUsers"
					stroke="#8989FF"
					strokeWidth={2}
					name="New Users"
					dot={false}
					hide={unselected['New Users']}
				/>
				<Line
					type="monotone"
					dataKey="newVerifiedUsers"
					stroke="#00FF00"
					strokeWidth={2}
					name="New Verified Users"
					dot={false}
					hide={unselected['New Verified Users']}
				/>
				<Line
					type="monotone"
					dataKey="newUnverifiedUsers"
					stroke="#FF9D9D"
					strokeWidth={2}
					name="New Unverified Users"
					dot={false}
					hide={unselected['New Unverified Users']}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

GrowthGraph.propTypes = {
	data: PropTypes.object,
};

export default GrowthGraph;
