const LandingPage = ({ currentUser }) => {
  return (
    <div>{currentUser ? 'Yout are logged in' : 'You are not logged in'}</div>
  );
};

export default LandingPage;
