import React from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip, Box } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

// const defaultToolbarSelectStyles = {
// 	iconButton: {
// 		marginRight: '16px',
// 		top: '50%',
// 		display: 'inline-block',
// 		position: 'relative',
// 	},
// };

const ToolbarSelect = (props) => {
	const { onRowsDelete, selectedRows, setSelectedRows, displayData } = props;

	const handleClickInverseSelection = () => {
		const nextSelectedRows = displayData.reduce((nextSelectedRows, _, index) => {
			if (!selectedRows.data.find((selectedRow) => selectedRow.index === index)) {
				nextSelectedRows.push(index);
			}

			return nextSelectedRows;
		}, []);

		setSelectedRows(nextSelectedRows);
	};

	const handleClickDeselectAll = () => {
		setSelectedRows([]);
	};

	const handleOnRowsDelete = () => {
		onRowsDelete(selectedRows);
		setSelectedRows([]);
	};

	return (
		<Box>
			<Tooltip title={'Deselect Selected'}>
				<IconButton onClick={handleClickDeselectAll}>
					<IndeterminateCheckBoxIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title={'Inverse selection'}>
				<IconButton onClick={handleClickInverseSelection}>
					<CompareArrowsIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title={'Delete Selected'}>
				<IconButton onClick={handleOnRowsDelete} aria-label={'Delete'}>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		</Box>
	);
};

ToolbarSelect.propTypes = {
	setSelectedRows: PropTypes.func,
	onRowsDelete: PropTypes.func,
	selectedRows: PropTypes.object,
	displayData: PropTypes.array,
};

// export default withStyles(defaultToolbarSelectStyles, { name: 'ToolbarSelect' })(ToolbarSelect);

export default ToolbarSelect;
