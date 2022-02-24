import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Consent = (props) => {
	const { consentHeader, warningText, onYes, open, setOpen } = props;

	const handleRequestNo = () => {
		setOpen(false);
	};

	const handleRequestYes = () => {
		setOpen(false);
		onYes();
	};

	return (
		<Box>
			<Dialog open={open} onClose={handleRequestNo}>
				<DialogTitle>{consentHeader}</DialogTitle>
				<DialogContent>
					<DialogContentText>{warningText}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleRequestNo} variant="contained" color="primary">
						No
					</Button>
					<Button onClick={handleRequestYes} variant="contained" color="warning">
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

Consent.propTypes = {
	consentHeader: PropTypes.string,
	warningText: PropTypes.string,
	onYes: PropTypes.func,
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};

export default Consent;
