import { Control, FieldValues, Path, Validate } from "react-hook-form";

export interface FormFieldPropsBase<
  FormFieldsType extends FieldValues,
  FieldType
> {
  control: Control<FormFieldsType>;
  name: Path<FormFieldsType>;
  validate?: Validate<FieldType, FormFieldsType>;
}
