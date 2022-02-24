import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { UsersQuery } from 'graphql/queries';
import DataTable from 'components/DataTable';
import StatusIcon from 'components/DataTable/StatusIcon';
import { formatDateTime } from 'helpers/Utils/dateHelper';

import { Menu, MenuItem, Button } from '@mui/material';

const UserList = ({ intl }) => {
	const history = useHistory();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedUserId, setSelectedUserId] = React.useState(null);

	const handleContextMenu = (e, id) => {
		setSelectedUserId(id);
		setAnchorEl(e.currentTarget);
	};

	const handleRedirectEdit = () => {
		history.push(`/app/users/${selectedUserId}/manage-profile`);
	};

	const handleDeleteUser = () => {};

	const columns = [
		{
			name: 'email',
			label: 'Email',
			options: {
				filter: false,
				customBodyRender: (value) => {
					return !_.isEmpty(value) ? <Link to={'#'}>{value}</Link> : '-';
				},
			},
		},
		{
			name: 'firstName',
			label: 'First Name',
			options: {
				filter: false,
			},
		},
		{
			name: 'isStaff',
			label: 'Is Staff',
			options: {
				filterOptions: {
					fullWidth: true,
					names: [true, false],
					renderValue: (v) => `${_.upperFirst(v)}`,
				},
				customFilterListOptions: { render: (v) => `Is Staff: ${_.upperFirst(v)}` },
				customBodyRender: (value, { rowData }) => <StatusIcon value={value} rowData={rowData} />,
			},
		},
		{
			name: 'isActive',
			label: 'Is Active',
			options: {
				filterOptions: {
					fullWidth: true,
					names: [true, false],
					renderValue: (v) => `${_.upperFirst(v)}`,
				},
				customFilterListOptions: { render: (v) => `Is Active: ${_.upperFirst(v)}` },
				customBodyRender: (value, { rowData }) => <StatusIcon value={value} rowData={rowData} />,
			},
		},
		{
			name: 'dateJoined',
			label: 'Joined On',
			options: {
				filter: false,
				searchable: false,
				customBodyRender: (value) => formatDateTime(value),
			},
		},
		{
			name: 'lastLogin',
			label: 'Last Login',
			options: {
				filter: false,
				searchable: false,
				customBodyRender: (value) => formatDateTime(value),
			},
		},
		{
			name: 'id',
			label: 'action',
			options: {
				filter: false,
				searchable: false,
				customBodyRender: (id) => (
					<>
						<Button aria-controls="manage-profile" aria-haspopup="true" onClick={(e) => handleContextMenu(e, id)}>
							Manage
						</Button>
					</>
				),
			},
		},
	];

	return (
		<>
			<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
				<MenuItem onClick={handleRedirectEdit}>Edit</MenuItem>
				<MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
				<MenuItem onClick={() => {}}>Activate</MenuItem>
			</Menu>
			<DataTable
				title={intl.formatMessage({ id: 'users.list.title' })}
				titleBar={intl.formatMessage({ id: 'users.list.titleBar' })}
				query={UsersQuery.GET_USERS}
				queryKey="users"
				columns={columns}
				defaultSortColumn="dateJoined"
				selectableRows="multiple"
				search={true}
				addRoute={'/app/users/create'}
				enableAddButton
			/>
		</>
	);
};

UserList.propTypes = {
	intl: PropTypes.object.isRequired,
};

export default injectIntl(UserList);
