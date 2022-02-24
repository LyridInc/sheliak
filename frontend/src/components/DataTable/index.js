import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import ToolbarSelect from './ToolbarSelect';
import Consent from 'components/Dialogs/Consent';
import TableTitle from 'components/Loaders/tableTitle';
import IntlMessages from 'helpers/Utils/IntlMessages';

// import { Button, IconButton, MuiThemeProvider, Tooltip } from '@material-ui/core';
// import { Add as AddIcon, Refresh as RefreshIcon } from '@material-ui/icons';

// import ContainerHeader from "components/ContainerHeader";
// import dataTableTheme from "helpers/DataTableTheme";
// import LoaderTypography from "components/Loaders/LoaderTypography";

const DataTable = (props) => {
	const {
		addRoute,
		columns,
		defaultSortColumn,
		deleteItemByKey = 'pk',
		deleteWarning = true,
		enableAddButton,
		query,
		queryKey,
		search,
		selectableRows,
		title,
		titleBar,
	} = props;

	const history = useHistory();

	// Datatable specific variables
	const [items, setItems] = useState([]);
	const [itemsTotalCount, setItemsTotalCount] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [sortFilters, setSortFilters] = useState([
		{ column: defaultSortColumn ? defaultSortColumn : 'createdOn', direction: 'desc' },
	]);
	const [queryFilters, setQueryFilters] = useState({});
	const [cols, setCols] = useState(columns);
	const [searchText, setSearchText] = useState('');
	const [deleteWarningConsent, setDeleteWarningConsent] = useState({ open: false, items: null });

	const [getItems, { loading }] = useLazyQuery(query, {
		onCompleted: (data) => {
			const totalCount = _.get(data, `${queryKey}.totalCount`, 0);
			const edges = _.get(data, `${queryKey}.edges`, []);
			const nodes = _.map(edges, (edge) => edge.node);
			setItemsTotalCount(totalCount);
			setItems(nodes);
		},
	});

	const createQueryVariables = (page, sText, rowsPerPage, sortFilters) => {
		let queryVars = {
			first: rowsPerPage,
			offset: page * rowsPerPage,
		};

		if (!_.isEmpty(sText)) {
			queryVars = {
				...queryVars,
				search: sText,
			};
		}

		if (!_.isEmpty(sortFilters)) {
			queryVars = {
				...queryVars,
				orderBy: `${sortFilters[0].direction === 'desc' ? '-' : ''}${sortFilters[0].column}`,
			};
		}

		if (!_.isEmpty(queryFilters)) {
			queryVars = {
				...queryVars,
				...queryFilters,
			};
		}

		return queryVars;
	};

	const queryVariables = useMemo(
		() => createQueryVariables(page, searchText, rowsPerPage, sortFilters, queryFilters),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[page, searchText, rowsPerPage, sortFilters, queryFilters],
	);

	// On Component Mount / Page Change - Load/Reload Table data
	useEffect(() => {
		getItems({
			variables: {
				...queryVariables,
			},
		});
	}, [getItems, queryVariables]);

	const handleNew = () => {
		history.push(addRoute);
	};

	const handlePageSort = (params) => {
		if (!_.isEmpty(params.sortOrder)) {
			const newSortFilter = [
				{
					column: params.sortOrder.name,
					direction: params.sortOrder.direction,
				},
			];
			setSortFilters(newSortFilter);
		}
	};

	const handlePageChange = (params) => {
		setRowsPerPage(params.rowsPerPage);
		setPage(params.page);
	};

	const handleSearch = _.debounce((params) => {
		setSearchText(params.searchText);
		setPage(0);
	}, 300);

	const handleFilterSubmit = (filterList) => {
		const queryFiltersObject = {};
		_.forEach(filterList(), (value, key) => {
			if (!_.isEmpty(value)) {
				const filter = {};
				filter[columns[key].name] = value[0] === '-' ? '' : value[0];
				_.extend(queryFiltersObject, filter);
			}
		});
		setPage(0);
		setQueryFilters(queryFiltersObject);
	};

	const handleFilterReset = () => {
		let newCols = columns.map((col) => {
			col.options.filterList = [];
			return col;
		});

		setCols(newCols);
		setQueryFilters({});
		setSearchText('');
	};

	const handleBulkDelete = (params) => {
		if (deleteItemByKey) {
			let itemIDs = [];
			params.data.forEach((row, index) => {
				if (items[row.dataIndex] !== undefined) {
					return (itemIDs[index] = items[row.dataIndex][deleteItemByKey]);
				}
			});

			if (deleteWarning) {
				return setDeleteWarningConsent({ open: true, items: itemIDs });
			}
			// TODO: Delete Query Implementation
			// dispatch(deleteItems(itemIDs));
		}
	};

	const onYesClick = () => {
		// dispatch(deleteItems(deleteWarningConsent.items));
		setDeleteWarningConsent({ open: !deleteWarningConsent.open, items: null });
	};

	const handleOpenPrompt = () => {
		setDeleteWarningConsent({ open: !deleteWarningConsent.open, items: deleteWarningConsent.items });
	};

	const options = {
		responsive: 'standard',
		rowsPerPage: rowsPerPage,
		rowsPerPageOptions: [10, 25, 50],
		count: itemsTotalCount,
		page: page,
		serverSide: true,
		tableBodyMaxHeight: '76vh',
		fixedHeader: true,
		fixedSelectColumn: true,
		selectableRows: selectableRows,
		sortOrder: { name: sortFilters[0].column, direction: sortFilters[0].direction },
		draggableColumns: {
			enabled: true,
		},
		filter: true,
		filterType: 'dropdown',
		confirmFilters: true,

		search: search,
		searchText: searchText,
		onSearchClose: () => {
			handleFilterReset();
		},
		customToolbar: () => {
			return (
				<>
					{enableAddButton && (
						<Tooltip title="Add">
							<IconButton onClick={handleNew}>
								<AddIcon />
							</IconButton>
						</Tooltip>
					)}
				</>
			);
		},
		customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
			return (
				<ToolbarSelect
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
					displayData={displayData}
					onRowsDelete={handleBulkDelete.bind(this)}
				/>
			);
		},
		onChangeRowsPerPage: (numberOfRows) => {
			setPage(0);
			setRowsPerPage(numberOfRows);
		},
		customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'end' }} mt={3}>
					<Button variant="contained" size="small" onClick={() => handleFilterSubmit(applyNewFilters)} color="primary">
						<IntlMessages id={'datatable.filters.button.submit'} />
					</Button>
				</Box>
			);
		},
		onFilterChange: (column, filterList, type) => {
			if (type === 'chip') {
				let newFilters = () => filterList;
				handleFilterSubmit(newFilters);
			}
		},
		onTableChange: (action, tableState) => {
			switch (action) {
				case 'changePage':
				case 'changeRowsPerPage':
					handlePageChange(tableState);
					break;
				case 'resetFilters':
					handleFilterReset();
					break;
				case 'sort':
					handlePageSort(tableState);
					break;
				case 'search':
					handleSearch(tableState);
					break;
			}
		},
	};

	return (
		<>
			<MUIDataTable
				title={<TableTitle title={titleBar} loading={loading} />}
				data={items}
				columns={cols}
				options={options}
			/>
			{/*<MuiThemeProvider theme={dataTableTheme()}>*/}
			{/*</MuiThemeProvider>*/}
			<Consent
				consentHeader={`Deleting ${title}`}
				warningText="Click Yes to confirm your delete."
				onYes={onYesClick}
				open={deleteWarningConsent.open}
				setOpen={() => handleOpenPrompt()}
			/>
		</>
	);
};

DataTable.propTypes = {
	title: PropTypes.string,
	titleBar: PropTypes.string,
	query: PropTypes.object,
	queryKey: PropTypes.string,
	columns: PropTypes.array,
	defaultSortColumn: PropTypes.string,
	enableAddButton: PropTypes.bool,
	deleteWarning: PropTypes.bool,
	addRoute: PropTypes.string,
	deleteItemByKey: PropTypes.string,
	selectableRows: PropTypes.string,
	search: PropTypes.bool,
};

export default DataTable;
