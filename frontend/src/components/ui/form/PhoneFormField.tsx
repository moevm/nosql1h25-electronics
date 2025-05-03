import styled from '@emotion/styled';
import { MuiTelInput, MuiTelInputProps, classes } from "mui-tel-input";
import { Controller, FieldValues } from 'react-hook-form';
import { FormFieldPropsBase } from './FormFieldPropsBase';

const MuiTelInputNoFlag = styled(MuiTelInput)`
  .${classes.flagButton} {
    display: none;
  }
`;

export type PhoneFormFieldProps<T extends FieldValues> =
  FormFieldPropsBase<T, string | undefined> &
  Omit<MuiTelInputProps, 'name' | 'forceCallingCode'>;
   

export const PhoneFormField = <T extends FieldValues>({ control, name, required, validate, ...muiTelInputProps }: PhoneFormFieldProps<T>) => (
  <Controller 
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <MuiTelInputNoFlag
        defaultCountry='RU'
        placeholder='987 654 32 10'
        disableDropdown
        forceCallingCode
        {...muiTelInputProps}
        required={required}
        helperText={fieldState.error?.message}
        error={!!fieldState.error}
        value={field.value ?? ''}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: (value: string, formValues) => {
        if (required && !value) return 'Обязательное поле';
        if (value.replace(/\s/g, '').length !== 12) return 'Некорректный номер телефона';

        return validate?.(value, formValues);
      },
    }}
  />
);

export default PhoneFormField;
