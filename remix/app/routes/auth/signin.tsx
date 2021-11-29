import { redirect, Form, ActionFunction, useActionData } from 'remix';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const email = data.get('email');
  const password = data.get('password');

  const headers = request.headers;
  headers.set('Content-Type', 'application/json');

  const response = await fetch(process.env.BASE_URL + '/api/users/signin', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    return redirect('/', {
      headers: {
        'set-cookie': response.headers.get('set-cookie') || '',
      },
    });
  }

  return response.json();
};

export default function Signin() {
  const data = useActionData();

  return (
    <div className="w-96">
      <h1 className="text-center text-4xl uppercase font-bold mb-8">
        Signin page
      </h1>
      <Form method="post">
        <div className="mb-2">
          <input
            className="border text-black px-4 py-2 rounded w-full"
            type="text"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-2">
          <input
            className="border text-black px-4 py-2 rounded w-full"
            type="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 rounded text-white bg-blue-700 w-full hover:bg-blue-800">
            Sign in
          </button>
        </div>
      </Form>
      {data?.errors ? (
        <ul>
          {data.errors.map((err: any) => (
            <li>
              {err.field} - {err.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
