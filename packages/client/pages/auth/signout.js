import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

export default function Signout() {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    data: {},
    onSuccess: () => {
      Router.push('/');
    },
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signout</div>;
}
