import { AssertSubtype, KeysMatching } from "@src/lib/typeUtility";
import { Control, FieldValues, Path, Validate } from "react-hook-form";

export interface FormFieldPropsBase<FormFieldsType extends FieldValues, FieldType>{
  control: Control<FormFieldsType>;
  name: AssertSubtype<KeysMatching<FormFieldsType, FieldType>, Path<FormFieldsType>>;
  validate?: Validate<FieldType, FormFieldsType>;
}
