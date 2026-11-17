import Logo from './Logo.jsx';
import Footer from './Footer.jsx';

export default function Intro({ resumable, onStart, honeypotRef }) {
  return (
    <main className="screen intro">
      <div className="intro-top"><Logo /></div>
      <div className="intro-mid">
        <h1 className="hero">A study on what riders want from their next motorcycle.</h1>
        <p className="meta">
          About 11 minutes.<br />
          No right or wrong answers.<br />
          Anonymous.
        </p>
        <button className="btn" onClick={onStart} autoFocus>
          {resumable ? 'Continue Survey' : 'Start Survey'}
        </button>
        {/* Honeypot: real riders never see or fill this. Bots often do. */}
        <input
          ref={honeypotRef}
          className="hp"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>
      <Footer />
    </main>
  );
}
