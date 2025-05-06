import { Controller, FieldValues } from 'react-hook-form';
import { FormFieldPropsBase } from './FormFieldPropsBase';
import { TextField, TextFieldProps } from '@mui/material';
import { merge } from 'ts-deepmerge';

export type TextFormFieldProps<T extends FieldValues> = 
  FormFieldPropsBase<T, string | undefined> &
  Omit<TextFieldProps, 'name'> & {
    minLength?: number;
    maxLength?: number;
    prohibitBlank?: boolean;
  };

export const TextFormField = <T extends FieldValues>
({ 
  control, 
  name, 
  required, 
  minLength, 
  maxLength, 
  prohibitBlank, 
  validate, 
  slotProps, 
  ...textFieldProps
}: TextFormFieldProps<T>) => (
  <Controller 
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <TextField 
        {...textFieldProps}
        slotProps={merge(
          { htmlInput: { maxLength }},
          slotProps ?? {},
        )}
        helperText={fieldState.error?.message}
        error={!!fieldState.error}
        value={field.value ?? ''}
        onChange={field.onChange}
      />
    )}
    rules={{ 
      validate: (value, formValues) => {
        if (!value) return required ? 'Обязательное поле' : undefined;

        if (prohibitBlank) {
          value = value.trim();
          if (!value) return 'Поле не может быть пустой строкой';
        }

        if (minLength && value.length < minLength) return `Минимальная длина: ${minLength}`;

        return validate?.(value, formValues);
      },
    }}
  />
);

export default TextFormField;
