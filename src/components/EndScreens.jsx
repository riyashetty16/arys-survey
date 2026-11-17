import Logo from './Logo.jsx';
import Footer from './Footer.jsx';

export function Thanks() {
  return (
    <main className="screen end">
      <div className="end-top"><Logo /></div>
      <h1 className="end-title">Thank You!</h1>
      <Footer />
    </main>
  );
}

function Message({ children }) {
  return (
    <main className="screen end">
      <div className="end-top"><Logo /></div>
      <p className="end-msg">{children}</p>
      <Footer />
    </main>
  );
}

export const ScreenedOut = () => (
  <Message>Thank you for your time. This study is looking for a different group of riders, so we will end here.</Message>
);
export const AlreadyTaken = () => (
  <Message>It looks like this survey has already been taken from this device or number. Thank you for your time.</Message>
);
export const Closed = () => (
  <Message>This survey is not taking responses right now. Thank you for your interest.</Message>
);
