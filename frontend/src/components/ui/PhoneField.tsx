import styled from '@emotion/styled';
import { MuiTelInput, MuiTelInputProps, classes } from 'mui-tel-input';

const MuiTelInputNoFlag = styled(MuiTelInput)`
  .${classes.flagButton} {
    display: none;
  }
`;

export type PhoneFieldProps = Omit<MuiTelInputProps, 'forceCallingCode'>;

export const PhoneField = (props: PhoneFieldProps) => (
  <MuiTelInputNoFlag 
    defaultCountry='RU'
    placeholder='987 654 32 10'
    disableDropdown
    forceCallingCode
    {...props}
  />
);

export default PhoneField;
