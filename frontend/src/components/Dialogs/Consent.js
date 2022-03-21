import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ButtonLoader from 'components/Buttons/ButtonWithLoader';

const Consent = (props) => {
	const { consentHeader, warningText, onYes, open, setOpen, loading } = props;

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
					<Box mx={2}>
						<ButtonLoader onClick={handleRequestYes} loader={!!loading} tooltip="" variant="contained" color="warning">
							Yes
						</ButtonLoader>
					</Box>
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
	loading: PropTypes.bool,
};

export default Consent;
