import { Link, LoaderFunction, redirect, Outlet, useLoaderData } from 'remix';

export const loader: LoaderFunction = async ({ request }) => {
  const res = await fetch(process.env.BASE_URL + '/api/users/currentuser', {
    headers: request.headers,
  });
  const { currentUser } = await res.json();

  if (!currentUser) {
    return redirect('/auth/signin');
  }
  return { currentUser };
};

export default function () {
  const { currentUser } = useLoaderData();

  return (
    <div className="remix-app">
      <header className="remix-app__header">
        Hello, {currentUser.email} <Link to="/auth/signout">Signout</Link>
      </header>
      <div className="remix-app__main">
        <div className="container remix-app__main-content">
          <Outlet />
        </div>
      </div>
      <footer className="remix-app__footer">
        <div className="container remix-app__footer-content">
          <p>&copy; You!</p>
        </div>
      </footer>
    </div>
  );
}
