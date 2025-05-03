import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { FormFieldPropsBase } from './FormFieldPropsBase';

export type CheckboxFormFieldProps<T extends FieldValues> =
  FormFieldPropsBase<T, boolean | undefined> &
  Omit<CheckboxProps, 'name'> & {
    label?: string;
  };

export const CheckboxFormField = <T extends FieldValues>({ control, name, label, validate, ...checkboxProps }: CheckboxFormFieldProps<T>) => (
  <Controller 
    control={control}
    name={name}
    render={({ field }) => (
      <FormControlLabel
        control={
          <Checkbox 
            {...checkboxProps} 
            checked={field.value ?? false}
            onChange={e => field.onChange(e.target.checked)}
          />
        }
        label={label}
      />
    )}
    rules={{ validate }}
  />
);

export default CheckboxFormField;
