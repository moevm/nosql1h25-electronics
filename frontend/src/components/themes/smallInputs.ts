import { createTheme } from "@mui/material";

export const smallInputsTheme = createTheme({
  components: {
    MuiInputBase: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});

export default smallInputsTheme;
