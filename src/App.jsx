import React from "react";
import "./App.css";
import stillwater from "./assets/stillwater5.jpg";

function WavyText({ text = "coming\u00A0\u00A0soon..." }) {
  // Tokenize so that consecutive dots (ellipsis) are grouped into one token
  const tokens = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ".") {
      // gather run of dots
      let j = i;
      while (j < text.length && text[j] === ".") j++;
      tokens.push(text.slice(i, j));
      i = j - 1;
    } else {
      tokens.push(ch);
    }
  }

  return (
    <h1 className="wavy" aria-label={text}>
      {tokens.map((tok, i) => (
        <span key={i} style={{ "--i": i }}>
          {tok}
        </span>
      ))}
    </h1>
  );
}

export default function App() {
  return (
    <div className="placeholder-root">
      <header className="placeholder-header" aria-hidden={false}>
        <div className="placeholder-container header-container">
          <WavyText />
        </div>
      </header>
      <main className="placeholder-main">
        <div className="placeholder-container">
          <img
            src={stillwater}
            alt="placeholder"
            className="placeholder-image"
          />
        </div>
      </main>
      <footer className="placeholder-footer" aria-hidden={true}></footer>
    </div>
  );
}
