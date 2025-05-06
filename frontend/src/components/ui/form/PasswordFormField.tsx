import { Controller, FieldValues } from 'react-hook-form';
import { TextFormFieldProps } from './TextFormField';
import PasswordField from '@src/components/ui/PasswordField';
import { merge } from 'ts-deepmerge';

export type PasswordFormFieldProps<T extends FieldValues> = TextFormFieldProps<T>;

export const PasswordFormField = <T extends FieldValues>
({ 
  control, 
  name, 
  required, 
  minLength, 
  maxLength, 
  prohibitBlank, 
  validate, 
  slotProps, 
  ...passwordFieldProps
}: PasswordFormFieldProps<T>) => (
  <Controller 
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <PasswordField 
        {...passwordFieldProps}
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

export default PasswordFormField;
