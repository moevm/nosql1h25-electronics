import { PhoneField, PhoneFieldProps } from '@src/components/ui/PhoneField';
import { Controller, FieldValues } from 'react-hook-form';
import { FormFieldPropsBase } from './FormFieldPropsBase';

export type PhoneFormFieldProps<T extends FieldValues> =
  FormFieldPropsBase<T, string | undefined> &
  Omit<PhoneFieldProps, 'name'>; 

export const PhoneFormField = <T extends FieldValues>
({ 
  control, 
  name, 
  required, 
  validate, 
  ...phoneFieldProps
}: PhoneFormFieldProps<T>) => (
  <Controller 
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <PhoneField
        {...phoneFieldProps}
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
