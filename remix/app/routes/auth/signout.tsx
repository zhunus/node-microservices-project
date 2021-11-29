import { LoaderFunction, redirect } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async ({ request }) => {
  const response = await fetch(process.env.BASE_URL + '/api/users/signout', {
    method: 'post',
    headers: request.headers,
  });

  if (response.ok) {
    return redirect('/', { headers: response.headers });
  }

  throw new Error('something went wrong');
};
