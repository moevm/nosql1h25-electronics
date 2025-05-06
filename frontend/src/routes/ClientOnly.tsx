import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@src/hooks/ReduxHooks';
import { selectIsInitialAuthorizing, selectIsClient } from '@src/store/UserSlice';
import { AuthorizedOnly } from './AuthorizedOnly';
import Loader from '@src/components/ui/Loader';

export interface ClientOnlyProps {
  children: React.ReactElement;
}

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  const isClient = useAppSelector(selectIsClient);
  const isInitialAuthorizing = useAppSelector(selectIsInitialAuthorizing);

  if (isInitialAuthorizing) return <Loader />;

  if (isClient) return children;
  
  return <AuthorizedOnly><Navigate to='/products' replace /></AuthorizedOnly>;
};

export default ClientOnly;
