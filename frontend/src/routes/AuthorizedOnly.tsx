import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@src/hooks/ReduxHooks';
import { selectIsAuthorized, selectIsInitialAuthorizing } from '@src/store/UserSlice';
import Loader from '@src/components/ui/Loader';

export interface AuthorizedOnlyProps {
  children: React.ReactElement;
  inverted?: boolean;
}

export const AuthorizedOnly = ({ children, inverted }: AuthorizedOnlyProps) => {
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const isInitialAuthorizing = useAppSelector(selectIsInitialAuthorizing);

  if (isInitialAuthorizing) return <Loader />

  if (!!inverted === isAuthorized) return <Navigate to={inverted ? '/products' : '/login'} replace />;

  return children
};

export default AuthorizedOnly;
