import { LATE } from '../data/questions.js';
import Footer from './Footer.jsx';

// Part 5 opening page. One-way door: no Back button.
export default function IdeaPage({ onContinue }) {
  const idea = LATE.idea;
  if (!idea) return null;
  return (
    <main className="screen idea card">
      <div className="idea-body">
        <h1 className="idea-title">{idea.heading}</h1>
        <p className="idea-text">{idea.body}</p>
        <button className="btn" onClick={onContinue} autoFocus>Continue</button>
      </div>
      <Footer />
    </main>
  );
}
