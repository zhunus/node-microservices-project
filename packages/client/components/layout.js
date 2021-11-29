import Link from 'next/link';

const Layout = ({ currentUser, children }) => {
  return (
    <>
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <a
          href="/"
          className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        />

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <Link href="/">
              <a className="nav-link px-2 link-secondary">Home</a>
            </Link>
          </li>
        </ul>

        {!currentUser ? (
          <div className="col-md-3 text-end">
            <a
              href="/auth/signin"
              type="button"
              className="btn btn-outline-primary mx-2"
            >
              Sign-in
            </a>
            <a href="/auth/signup" type="button" className="btn btn-primary">
              Sign-up
            </a>
          </div>
        ) : (
          <div className="col-md-3 text-end ">
            <span className="mr-4">{currentUser.email}</span>
            <a href="/auth/signout" type="button" className="btn btn-primary">
              Sign-out
            </a>
          </div>
        )}
      </header>
      <main className="container">{children}</main>
      <footer />
    </>
  );
};

export default Layout;
