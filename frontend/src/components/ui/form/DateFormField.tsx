import { Controller, FieldValues } from 'react-hook-form';
import { FormFieldPropsBase } from './FormFieldPropsBase';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { merge } from 'ts-deepmerge';

export type DateType = Dayjs;

export type DateFormFieldProps<T extends FieldValues> =
  FormFieldPropsBase<T, DateType | undefined> &
  Omit<DatePickerProps<DateType>, 'name'> & {
    minDate?: DateType;
    maxDate?: DateType;
    prohibitFuture?: boolean;
    required?: boolean;
  };

export const DateFormField = <T extends FieldValues>
({ 
  control, 
  name, 
  minDate, 
  maxDate, 
  required, 
  prohibitFuture, 
  validate, 
  slotProps, 
  ...datePickerProps 
}: DateFormFieldProps<T>) => (
  <Controller 
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <DatePicker 
        {...datePickerProps}
        minDate={minDate}
        maxDate={prohibitFuture ? dayjs() : maxDate}
        slotProps={merge(
          {
            textField: {
              helperText: fieldState.error?.message,
              error: !!fieldState.error,
            },
          },
          slotProps ?? {},
        )}
        value={field.value ?? null}
        onChange={field.onChange}
      />
    )}
    rules={{
      validate: (value: DateType | undefined, formFields) => {
        if (!value) return required ? 'Обязательное поле' : undefined;
        if (prohibitFuture && value > dayjs()) return 'Выбрана дата из будущего';
        if (!prohibitFuture && maxDate && value > maxDate) return 'Выбрана дата из недопустимого диапазона';
        if (minDate && value < minDate) return 'Выбрана дата из недопустимого диапазона';
        
        return validate?.(value, formFields);
      },
    }}
  />
);

export default DateFormField;
