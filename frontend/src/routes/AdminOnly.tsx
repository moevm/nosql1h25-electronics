import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@src/hooks/ReduxHooks';
import { selectIsAdmin, selectIsInitialAuthorizing } from '@src/store/UserSlice';
import { AuthorizedOnly } from './AuthorizedOnly';
import Loader from '@src/components/ui/Loader';

export interface AdminOnlyProps {
  children: React.ReactElement;
}

export const AdminOnly = ({ children }: AdminOnlyProps) => {
  const isAdmin = useAppSelector(selectIsAdmin);
  const isInitialAuthorizing = useAppSelector(selectIsInitialAuthorizing);

  if (isInitialAuthorizing) return <Loader />

  if (isAdmin) return children;
  
  return <AuthorizedOnly><Navigate to='/products' replace /></AuthorizedOnly>;
};

export default AdminOnly;
