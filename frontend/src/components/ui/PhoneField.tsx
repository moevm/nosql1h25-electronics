import styled from '@emotion/styled';
import { MuiTelInput, classes } from "mui-tel-input";
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { AssertSubtype, KeysMatching } from '@src/lib/typeUtility';

const MuiTelInputNoFlag = styled(MuiTelInput)`
  .${classes.flagButton} {
    display: none;
  }
`;

// TODO: позже сделать рефакторинг (вместе с пр с правками)
export interface FieldPropsBase<DataType extends FieldValues, TargetType>{ 
  control: Control<DataType>;
  name: AssertSubtype<KeysMatching<DataType, TargetType | undefined>, Path<DataType>>;
}

export interface PhoneFieldProps<T extends FieldValues> extends FieldPropsBase<T, string> {
  required?: boolean;
}

export const PhoneField = <T extends FieldValues>({ name, control, required }: PhoneFieldProps<T>) => (
  <Controller 
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <MuiTelInputNoFlag
        defaultCountry='RU'
        placeholder='987 654 32 10'
        disableDropdown
        forceCallingCode
        required={required}
        helperText={fieldState.error?.message}
        error={!!fieldState.error}
        value={field.value ?? ''}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: {
        required: (value?: string) => {
          if (required && !value) return 'Обязательное поле';
          if (value && value.replace(/\s/g, '').length !== 12) return 'Некорректный номер';
        },
      },
    }}
  />
);

export default PhoneField;
