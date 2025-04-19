import { Checkbox, CheckboxProps, FormControlLabel, TextField, TextFieldProps } from "@mui/material";
import { KeysMatching } from "@src/lib/typeUtility";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { PasswordField, PasswordFieldProps } from "./PasswordField";

export type TextFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: KeysMatching<T, string | undefined> extends Path<T> ? KeysMatching<T, string | undefined> : never;
} & Omit<TextFieldProps, 'name'>;

export const TextFormField = <T extends FieldValues>({ control, name, required, ...textFieldProps }: TextFormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <TextField
        {...textFieldProps}
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
} & Omit<PasswordFieldProps, 'name'>;

export const PasswordFormField = <T extends FieldValues>({ control, name, ...passwordFieldProps }: PasswordFormField<T>) => (
  <Controller 
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <PasswordField 
        {...passwordFieldProps}
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
        },
      },
    }}
  />
);
