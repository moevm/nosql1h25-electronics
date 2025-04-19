import { Checkbox, CheckboxProps, FormControlLabel, TextField, TextFieldProps } from "@mui/material";
import { KeysMatching } from "@src/lib/typeUtility";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { PasswordField, PasswordFieldProps } from "./PasswordField";
import { merge } from 'ts-deepmerge';

export type TextFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: KeysMatching<T, string | undefined> extends Path<T> ? KeysMatching<T, string | undefined> : never;
  minLength?: number;
  maxLength?: number;
} & Omit<TextFieldProps, 'name'>;

export const TextFormField = <T extends FieldValues>({ control, name, required, minLength, maxLength, slotProps, ...textFieldProps }: TextFormFieldProps<T>) => (
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
        value={field.value}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: {
        require: value => {
          if (!value) return required ? 'Обязательное поле' : undefined;
          if (!value.trim()) return 'Поле не может быть пустой строкой';
          if (minLength && value.length < minLength) return `Минимальная длина: ${minLength}`;
        },
      },
    }}
  />
);

export type CheckboxFormField<T extends FieldValues> = {
  control: Control<T>;
  name: KeysMatching<T, boolean> extends Path<T> ? KeysMatching<T, boolean> : never;
  label?: string;
} & Omit<CheckboxProps, 'name'>;

export const CheckboxFormField = <T extends FieldValues>({ control, name, label, ...checkboxProps }: CheckboxFormField<T>) => (
  <Controller 
    name={name}
    control={control}
    render={({ field }) => (
      <FormControlLabel 
        control={<Checkbox
          {...checkboxProps}
          value={field.value}
          onChange={field.onChange}
        />} 
        label={label}
      />
    )}
  />
);

export type PasswordFormField<T extends FieldValues> = {
  control: Control<T>;
  name: KeysMatching<T, string> extends Path<T> ? KeysMatching<T, string> : never;
  minLength?: number;
  maxLength?: number;
} & Omit<PasswordFieldProps, 'name'>;

export const PasswordFormField = <T extends FieldValues>({ control, name, minLength, maxLength, slotProps, ...passwordFieldProps }: PasswordFormField<T>) => (
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
        value={field.value}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: {
        required: (value: string) => {
          if (!value) return 'Обязательное поле';
          if (minLength && value.length < minLength) return `Минимальная длина: ${minLength}`;
        },
      },
    }}
  />
);
