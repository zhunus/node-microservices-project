import { useState } from 'react';
import Router from 'next/router';
import classNames from 'classnames';
import useRequest from '../../hooks/useRequest';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { errors, doRequest } = useRequest({
    url: '/api/users/signin',
    method: 'POST',
    data: { email, password },
    onSuccess: () => {
      Router.push('/');
    },
  });

  async function onSubmit(event) {
    event.preventDefault();
    await doRequest();
  }

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center p-4">
      <div className="w-25">
        <form onSubmit={onSubmit}>
          <h1 className="text-center">Signin</h1>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              className={classNames('form-control', {
                'is-invalid': errors.find((err) => err.field === 'email'),
              })}
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="invalid-feedback">
              {errors.find((err) => err.field === 'email')?.message}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className={classNames('form-control', {
                'is-invalid': errors.find((err) => err.field === 'password'),
              })}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="invalid-feedback">
              {errors.find((err) => err.field === 'password')?.message}
            </div>
          </div>
          <div className="text-danger text-small">
            {errors.reduce((acc, err) => (acc += err.message + '; '), '')}
          </div>
          <button className="btn btn-success">Sign in </button>
        </form>
      </div>
    </div>
  );
};
