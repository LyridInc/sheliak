import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { Popover, Button, Box } from '@mui/material';

import { defaultInputRanges, defaultStaticRanges } from 'helpers/Utils/dateHelper';

const DateRange = ({ selectionRange, setSelectionRange }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	const handleSelect = (ranges) => {
		setSelectionRange({
			...selectionRange,
			...ranges.selection,
		});
	};

	return (
		<Box>
			<Button variant="contained" onClick={handleClick}>
				{format(selectionRange.startDate, 'PP')} - {format(selectionRange.endDate, 'PP')}
			</Button>

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				<DateRangePicker
					inputRanges={defaultInputRanges}
					staticRanges={defaultStaticRanges}
					maxDate={new Date()}
					ranges={[selectionRange]}
					onChange={handleSelect}
				/>
			</Popover>
		</Box>
	);
};

DateRange.propTypes = {
	selectionRange: PropTypes.object,
	setSelectionRange: PropTypes.func,
};

export default DateRange;
