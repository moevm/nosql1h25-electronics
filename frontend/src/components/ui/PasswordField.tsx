import { TextFieldProps, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

export const PasswordField = (props: Omit<TextFieldProps, 'type' | 'slotProps'>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField 
      type={showPassword ? 'text' : 'password'} 
      slotProps={{ input: { endAdornment: (
        <InputAdornment position='end'>
          <IconButton edge='end' onClick={() => setShowPassword(x => !x)}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ) }}} 
      {...props} 
    />
  );
};

export default PasswordField;
