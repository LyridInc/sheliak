import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { useMutation } from '@apollo/client';
import { UsersMutation } from 'graphql/mutations';
import { UsersQuery } from 'graphql/queries';
import { formatDateTime } from 'helpers/Utils/dateHelper';
import DataTable from 'components/DataTable';
import StatusIcon from 'components/DataTable/StatusIcon';
import Consent from 'components/Dialogs/Consent';

import { Menu, MenuItem, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const UserList = ({ intl }) => {
	const history = useHistory();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedUser, setSelectedUser] = React.useState(null);
	const [activationConsentOpen, setActivationConsentOpen] = React.useState(false);
	const [deletionConsentOpen, setDeletionConsentOpen] = React.useState(false);
	const [triggerRefresh, setTriggerRefresh] = React.useState(0);

	const [toggleUserActivation, { loading: activationLoading }] = useMutation(UsersMutation.TOGGLE_USER_ACTIVATION, {
		onCompleted: () => {
			setActivationConsentOpen(!activationConsentOpen);
			setTriggerRefresh(triggerRefresh + 1);
			setAnchorEl(null);
		},
	});

	const handleUserActivation = () => {
		toggleUserActivation({
			variables: {
				id: selectedUser[6],
				isActive: !selectedUser[3],
			},
		});
	};

	const handleDeleteUser = () => {};

	const handleContextMenu = (e, user) => {
		setSelectedUser(user);
		setAnchorEl(e.currentTarget);
	};

	const handleRedirectEdit = () => {
		history.push(`/app/users/${selectedUser[6]}/manage-profile`);
	};

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
				customBodyRender: (value, { rowData }) => <StatusIcon value={value} rowData={rowData} fieldIndex={3} />,
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
			label: 'Action',
			options: {
				filter: false,
				searchable: false,
				customBodyRender: (_, { rowData }) => (
					<>
						<Button aria-controls="manage-profile" aria-haspopup="true" onClick={(e) => handleContextMenu(e, rowData)}>
							<MoreVertIcon />
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
				<MenuItem onClick={() => setDeletionConsentOpen(!deletionConsentOpen)}>Delete</MenuItem>
				<MenuItem onClick={() => setActivationConsentOpen(!activationConsentOpen)}>
					{selectedUser && selectedUser[3] ? 'Deactivate' : 'Activate'}
				</MenuItem>
			</Menu>
			<Consent
				open={activationConsentOpen}
				setOpen={setActivationConsentOpen}
				onYes={handleUserActivation}
				loading={activationLoading}
				consentHeader={intl.formatMessage({ id: 'users.list.consent.activation.header' })}
				warningText={intl.formatMessage({
					id: `users.list.consent.activation.warning_text.${selectedUser && selectedUser[3] ? 'deactivate' : 'activate'}`,
				})}
			/>
			<Consent
				open={deletionConsentOpen}
				setOpen={setDeletionConsentOpen}
				onYes={handleDeleteUser}
				consentHeader={intl.formatMessage({ id: 'users.list.consent.deletion.header' })}
				warningText={intl.formatMessage({ id: `users.list.consent.deletion.warning_text` })}
			/>
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
				triggerRefresh={triggerRefresh}
			/>
		</>
	);
};

UserList.propTypes = {
	intl: PropTypes.object.isRequired,
};

export default injectIntl(UserList);
