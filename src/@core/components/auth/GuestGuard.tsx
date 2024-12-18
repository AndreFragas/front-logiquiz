import {useRouter} from 'next/router';
import {ReactElement, ReactNode, useEffect} from 'react';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import {getLocalStorage} from 'src/@prismafive/storage-controler';

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  const {children, fallback} = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.pathname === '/login') {
      if (getLocalStorage(window, 'userData')) {
        router.replace('/home');
      }
    }
  }, [router.route]);

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
