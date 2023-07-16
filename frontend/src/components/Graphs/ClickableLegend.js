import React from 'react';
import PropTypes from 'prop-types';

const ClickableLegend = (props) => {
	const { payload, onClick, unselected } = props;

	return (
		<ul>
			{payload.map((entry, index) => (
				<li key={`item-${index}`} onClick={() => onClick(entry)}>
					<svg width="14" height="14" style={{ marginRight: '4px' }}>
						<line
							stroke={entry.color}
							strokeWidth="2"
							x1="0"
							y1="0"
							x2="14"
							y2="14"
							style={{ visibility: unselected[entry.value] ? 'visible' : 'hidden' }}
						/>
						<rect width="14" height="14" style={{ fill: entry.color }} />
					</svg>
					{entry.value}
				</li>
			))}
		</ul>
	);
};

ClickableLegend.propTypes = {
	payload: PropTypes.object,
	onClick: PropTypes.func,
	unselected: PropTypes.object,
};

export default ClickableLegend;
