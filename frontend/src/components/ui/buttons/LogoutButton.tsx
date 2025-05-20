import { Button, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@src/hooks/ReduxHooks';
import { logout, selectIsLoggingOut } from '@src/store/UserSlice';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const isLoggingOut = useAppSelector(selectIsLoggingOut);

  const onClick= async () => dispatch(logout());

  return (
    <Button
      variant='contained'
      disabled={isLoggingOut}
      onClick={onClick}
    >
      { isLoggingOut ? <CircularProgress size={25} /> : 'Выход' }
    </Button>
  );
};

export default LogoutButton;
