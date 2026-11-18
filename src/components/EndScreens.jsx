import Logo from './Logo.jsx';
import Footer from './Footer.jsx';

function ResetButton() {
  const handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <button
      type="button"
      className="test-reset-btn"
      onClick={handleReset}
    >
      Reset / Clear Local Data (Testing)
    </button>
  );
}

export function Thanks() {
  return (
    <main className="screen end">
      <div className="end-top"><Logo /></div>
      <h1 className="end-title">Thank You!</h1>
      <ResetButton />
      <Footer />
    </main>
  );
}

function Message({ children, showReset = false }) {
  return (
    <main className="screen end">
      <div className="end-top"><Logo /></div>
      <p className="end-msg">{children}</p>
      {showReset && <ResetButton />}
      <Footer />
    </main>
  );
}

export const ScreenedOut = () => (
  <Message showReset>Thank you for your time. This study is looking for a different group of riders, so we will end here.</Message>
);
export const AlreadyTaken = () => (
  <Message showReset>It looks like this survey has already been taken from this device or number. Thank you for your time.</Message>
);
export const Closed = () => (
  <Message>This survey is not taking responses right now. Thank you for your interest.</Message>
);
