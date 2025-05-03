import { Controller, FieldValues } from 'react-hook-form';
import { FormFieldPropsBase } from './FormFieldPropsBase';
import { FormControl, FormHelperText, MenuItem, Select, SelectProps } from '@mui/material';

export type SelectFormFieldProps<FormFieldsType extends FieldValues, ValuesType extends string> = 
  FormFieldPropsBase<FormFieldsType, ValuesType> &
  Omit<SelectProps, 'name'> & {
    options: Record<ValuesType, string>;
  };

export const SelectFormField = <FormFieldsType extends FieldValues, ValuesType extends string>({ control, name, options, defaultValue, ...selectProps }: SelectFormFieldProps<FormFieldsType, ValuesType>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <FormControl>
        <Select 
          {...selectProps}
          error={!!fieldState.error}
          value={field.value}
          onChange={field.onChange}
        >
          {Object.entries(options).map(([value, label]) => (
            <MenuItem 
              key={value}
              value={value as ValuesType}
            >
              {label as string}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    )}
  />
);
