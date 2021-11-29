import { Link } from 'remix';
import Logo from '../assets/logo.svg';

export function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <header className="bg-gray-700 text-xs text-white py-1">
        <div className="flex justify-between container mx-auto">
          <ul className="flex uppercase">
            <li className="mr-2 hover:underline cursor-pointer">ru</li>
            <li className="mr-2 hover:underline cursor-pointer">kz</li>
            <li className="font-bold">en</li>
          </ul>
          <nav className="flex justify-end">
            <Link
              to="signin"
              className="mr-2 uppercase hover:underline cursor-pointer"
            >
              log in
            </Link>
            <Link
              to="signin"
              className="uppercase hover:underline cursor-pointer"
            >
              sign up
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto">
        <div className="flex justify-center my-4">
          <img className="h-4" src={Logo} alt="ticketing.dev" />
        </div>
        {children}
      </main>
      <footer className="bg-gray-200 py-1">
        <div className="container mx-auto text-center text-xs">
          &copy; ticketing.dev
        </div>
      </footer>
    </>
  );
}
