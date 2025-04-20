import { createTheme } from "@mui/material";

export const SmallInputsTheme = createTheme({
  components: {
    MuiInputBase: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});

export default SmallInputsTheme;
