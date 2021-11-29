import { Outlet, redirect, LoaderFunction } from 'remix';

export const loader: LoaderFunction = async ({ request }) => {
  const res = await fetch(process.env.BASE_URL + '/api/users/currentuser', {
    headers: request.headers,
  });
  const { currentUser } = await res.json();

  if (currentUser && request.url !== '/auth/signout') {
    return redirect('/');
  }
  return { currentUser };
};

export default function Auth() {
  return (
    <div className="min-h-screen flex justify-center items-center text-white bg-gradient-to-b from-purple-500 to-red-500">
      <Outlet />
    </div>
  );
}
