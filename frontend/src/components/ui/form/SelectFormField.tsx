import { Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { FormFieldPropsBase } from './FormFieldPropsBase';
import { FormControl, FormHelperText, MenuItem, Select, SelectProps } from '@mui/material';

export type SelectFormFieldProps<
  FormFieldsType extends FieldValues,
  Name extends Path<FormFieldsType>,
  ValuesType extends string,
> = 
  FormFieldPropsBase<FormFieldsType, PathValue<FormFieldsType, Name>> &
  Omit<SelectProps, 'name'> & {
    name: Name;
    options: Record<ValuesType, string>;
    defaultValue?: PathValue<FormFieldsType, Name>;
  };

export const SelectFormField = <
  FormFieldsType extends FieldValues,
  Name extends Path<FormFieldsType>, 
  ValuesType extends string,
>({ 
  control, 
  name, 
  options, 
  defaultValue, 
  ...selectProps
}: SelectFormFieldProps<FormFieldsType, Name, ValuesType>) => (
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
    defaultValue={defaultValue}
  />
);
