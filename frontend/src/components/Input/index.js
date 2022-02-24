import React from 'react';
import { TextField, Box, FormControlLabel, Switch } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';

const renderTextField = (register, errors, fieldName, intlPrefix, type = 'text') => {
	const { ref: fieldRef, ...fieldInputProps } = register(fieldName);

	return (
		<FormattedMessage id={`${intlPrefix}.placeholder`}>
			{(placeholder) => (
				<TextField
					{...fieldInputProps}
					type={type}
					label={<FormattedMessage id={`${intlPrefix}.label`} />}
					variant="standard"
					inputRef={fieldRef}
					InputLabelProps={{
						shrink: true,
					}}
					error={!!errors[fieldName]}
					helperText={errors[fieldName] ? errors[fieldName].message : ''}
					placeholder={placeholder[0]}
					fullWidth
				/>
			)}
		</FormattedMessage>
	);
};

const renderSwitch = (register, control, fieldName, intlPrefix) => {
	const { ref: fieldRef, ...fieldInputProps } = register(fieldName);

	return (
		<Box display="flex" justifyContent="flex-start">
			<FormattedMessage id={`${intlPrefix}.label`}>
				{(label) => (
					<Controller
						{...fieldInputProps}
						control={control}
						inputRef={fieldRef}
						defaultValue={false}
						render={({ field }) => (
							<FormControlLabel name={fieldName} control={<Switch {...field} checked={field.value} />} label={label[0]} />
						)}
					/>
				)}
			</FormattedMessage>
		</Box>
	);
};

const renderAutoComplete = (register, errors, fieldName, options, intlPrefix) => {
	const { ref: fieldRef, ...fieldInputProps } = register(fieldName);

	return (
		<FormattedMessage id={`${intlPrefix}.placeholder`}>
			{(placeholder) => (
				<Autocomplete
					disablePortal
					options={options}
					renderInput={(params) => (
						<TextField
							{...params}
							{...fieldInputProps}
							inputRef={fieldRef}
							label={<FormattedMessage id={`${intlPrefix}.label`} />}
							InputLabelProps={{ shrink: true }}
							error={!!errors[fieldName]}
							helperText={errors[fieldName] ? errors[fieldName].message : ''}
							placeholder={placeholder[0]}
							fullWidth
							variant="standard"
						/>
					)}
				/>
			)}
		</FormattedMessage>
	);
};

export { renderTextField, renderSwitch, renderAutoComplete };
