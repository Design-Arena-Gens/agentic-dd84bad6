"use client";

import { FormEvent, useMemo, useState } from "react";
import { generateHandleIdeas } from "@/lib/handleGenerator";

export default function HomePage() {
  const [nameInput, setNameInput] = useState("");
  const [activeName, setActiveName] = useState("");
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = nameInput.trim();
    setActiveName(cleaned);
  };

  const suggestions = useMemo(() => generateHandleIdeas(activeName), [activeName]);

  const copyHandle = async (handle: string) => {
    try {
      await navigator.clipboard.writeText(handle);
      setCopiedHandle(handle);
      setTimeout(() => setCopiedHandle((prev) => (prev === handle ? null : prev)), 1500);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <main className="page">
      <div className="card">
        <header className="header">
          <span className="badge">Handle Agent</span>
          <h1>Craft ready-to-use social usernames</h1>
          <p>
            Drop in your name and let the agent remix it into platform-tuned handles. Polished,
            energetic, and professional takes in seconds.
          </p>
        </header>

        <form className="prompt" onSubmit={handleSubmit}>
          <label htmlFor="name-input" className="prompt__label">
            What name should we build around?
          </label>
          <div className="prompt__field">
            <input
              id="name-input"
              name="name"
              type="text"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="e.g. Alex Rivera"
              aria-describedby="prompt-help"
              required
              minLength={2}
              maxLength={50}
            />
            <button type="submit">Generate</button>
          </div>
          <p id="prompt-help" className="prompt__help">
            We keep everything on-device—no data leaves this page.
          </p>
        </form>

        {activeName && suggestions.length > 0 ? (
          <section className="results" aria-live="polite">
            {suggestions.map((suggestion) => (
              <article key={suggestion.platform} className="results__panel">
                <header>
                  <h2>{suggestion.platform}</h2>
                  <p>{suggestion.tagline}</p>
                </header>
                <ul>
                  {suggestion.handles.map((handle) => (
                    <li key={handle}>
                      <code>{handle}</code>
                      <button
                        type="button"
                        onClick={() => copyHandle(handle)}
                        aria-label={`Copy ${handle} for ${suggestion.platform}`}
                      >
                        {copiedHandle === handle ? "Copied" : "Copy"}
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        ) : (
          <section className="empty" aria-live="polite">
            <h2>Enter a name to see tailored handles</h2>
            <p>
              We will blend tonal cues across platforms—clean for Instagram, bold for TikTok,
              and credible for LinkedIn.
            </p>
          </section>
        )}
      </div>

      <style jsx>{`
        .page {
          display: flex;
          justify-content: center;
          padding: 4rem 1.5rem 6rem;
        }

        .card {
          width: min(960px, 100%);
          background: rgba(255, 255, 255, 0.85);
          border-radius: 32px;
          padding: 3rem clamp(1.5rem, 3vw, 3.5rem);
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
          backdrop-filter: blur(16px);
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .badge {
          align-self: flex-start;
          background: linear-gradient(120deg, #4338ca, #6366f1);
          color: #f8fafc;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 0.75rem;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
        }

        h1 {
          margin: 0;
          font-size: clamp(2.5rem, 4vw, 3rem);
          line-height: 1.1;
        }

        h2 {
          margin: 0;
          font-size: 1.4rem;
        }

        p {
          margin: 0;
          color: #475569;
          font-size: 1rem;
          line-height: 1.6;
        }

        .prompt {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .prompt__label {
          font-weight: 600;
          color: #1e293b;
        }

        .prompt__field {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        input[type="text"] {
          flex: 1 1 240px;
          padding: 0.9rem 1.1rem;
          border-radius: 14px;
          border: 1px solid rgba(99, 102, 241, 0.3);
          background: rgba(248, 250, 252, 0.9);
          font-size: 1rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        input[type="text"]:focus {
          outline: none;
          border-color: #4c51bf;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        button[type="submit"] {
          border: none;
          padding: 0.9rem 1.6rem;
          border-radius: 12px;
          background: linear-gradient(140deg, #4c51bf, #6366f1);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        button[type="submit"]:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.25);
        }

        button[type="submit"]:active {
          transform: translateY(0);
        }

        .prompt__help {
          font-size: 0.85rem;
          color: #64748b;
        }

        .results {
          display: grid;
          gap: 1.5rem;
        }

        .results__panel {
          border-radius: 24px;
          padding: 1.8rem;
          background: rgba(248, 250, 252, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.25);
          display: grid;
          gap: 1rem;
        }

        .results__panel header {
          display: grid;
          gap: 0.35rem;
        }

        ul {
          display: grid;
          gap: 0.75rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 0.9rem;
          border-radius: 14px;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        code {
          font-family: "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 0.95rem;
          color: #1d4ed8;
          word-break: break-all;
        }

        li button {
          padding: 0.55rem 1.1rem;
          border-radius: 10px;
          border: none;
          background: rgba(79, 70, 229, 0.12);
          color: #312e81;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        li button:hover {
          background: rgba(79, 70, 229, 0.2);
        }

        li button:active {
          background: rgba(79, 70, 229, 0.3);
        }

        .empty {
          display: grid;
          gap: 0.75rem;
          text-align: left;
          background: rgba(248, 250, 252, 0.9);
          padding: 2rem;
          border-radius: 20px;
          border: 1px dashed rgba(148, 163, 184, 0.35);
        }

        @media (max-width: 720px) {
          .card {
            padding: 2.5rem 1.5rem;
            border-radius: 24px;
          }

          li {
            align-items: flex-start;
            flex-direction: column;
          }

          li button {
            align-self: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
