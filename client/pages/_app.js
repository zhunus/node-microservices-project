import Layout from '../components/layout';
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Layout currentUser={currentUser}>
      <Component {...pageProps} currentUser={currentUser} />
    </Layout>
  );
};

AppComponent.getInitialProps = async ({ ctx, Component }) => {
  try {
    const client = buildClient(ctx);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const response = await client.post('/api/users/signin', {
      email: 'email@email.com',
      password: '123456',
    });

    console.log(response);

    return { ...data, pageProps };
  } catch (err) {
    console.log(err);
    console.error(err);
    return {};
  }
};

export default AppComponent;
