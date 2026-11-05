"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { askMap, type AskResult } from "@/lib/ask-map";
import { journeyStops, type JourneyStopId } from "@/lib/data";

const SUGGESTIONS = [
  "Where did you do computer vision research?",
  "What have you built with RAG?",
  "Where did you study?",
];

const STEP_MS = 550;

type Props = {
  onFly: (id: JourneyStopId) => void;
  onActiveChange: (active: boolean) => void;
};

function Step({ agent, children }: { agent: string; children: React.ReactNode }) {
  return (
    <li className="pass-in grid grid-cols-[76px_1fr] gap-2 font-mono text-xs leading-relaxed">
      <span className="text-accent-secondary">{agent}</span>
      <span className="text-muted">{children}</span>
    </li>
  );
}

export default function AskTheMap({ onFly, onActiveChange }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [stepsShown, setStepsShown] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  useEffect(() => clearTimers, []);

  const run = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    clearTimers();
    const answer = askMap(trimmed);
    const stepMs = shouldReduceMotion ? 0 : STEP_MS;
    setResult(answer);
    setStepsShown(1);
    onActiveChange(true);
    timersRef.current = [
      setTimeout(() => setStepsShown(2), stepMs),
      setTimeout(() => {
        setStepsShown(3);
        if (answer.match?.stopId) onFly(answer.match.stopId);
      }, stepMs * 2),
    ];
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(question);
  };

  const reset = () => {
    clearTimers();
    setResult(null);
    setStepsShown(0);
    setQuestion("");
    onActiveChange(false);
  };

  const match = result?.match ?? null;
  const stop = match?.stopId ? journeyStops.find((s) => s.id === match.stopId) : null;
  const keywords = result?.keywords ?? [];

  return (
    <>
      <form onSubmit={onSubmit} role="search" className="flex w-full items-center gap-2 lg:ml-auto lg:w-[440px]">
        <label htmlFor="ask-the-map" className="flex-none font-mono text-xs text-muted">
          Ask the map
        </label>
        <input
          id="ask-the-map"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={120}
          autoComplete="off"
          spellCheck={false}
          placeholder="Where did you study?"
          className="min-w-0 flex-1 rounded-full border border-border-strong bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          className="flex-none rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-accent transition-colors"
        >
          Ask
        </button>
      </form>

      {!result && (
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 lg:justify-end">
          <span className="font-mono text-[11px] text-muted">Try</span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuestion(suggestion);
                run(suggestion);
              }}
              className="text-left text-xs text-muted underline decoration-border-strong underline-offset-4 hover:text-accent transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {result && (
        <div className="w-full rounded-[10px] border border-border p-4 sm:p-5" aria-live="polite">
          <ol className="flex flex-col gap-1">
            <Step agent="planner">
              {keywords.length > 0 ? `Looking for: ${keywords.join(", ")}` : "Looking for what's current"}
            </Step>
            {stepsShown >= 2 && (
              <Step agent="retriever">
                Checked {result.passagesChecked} passages from this site.{" "}
                {match ? `Best match: ${match.title}` : "Nothing strong enough to answer from."}
              </Step>
            )}
            {stepsShown >= 3 && (
              <Step agent="navigator">
                {stop
                  ? `Flying to ${stop.city} and opening the ${stop.code} pass.`
                  : match
                    ? "Staying put. This one isn't tied to a place on the map."
                    : "Staying put."}
              </Step>
            )}
          </ol>

          {stepsShown >= 3 && (
            <div className="pass-in mt-4 border-t border-border pt-4">
              {match ? (
                <>
                  <p className="text-sm font-medium text-foreground">{match.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">{match.subtitle}</p>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground">{match.text}</p>
                  <Link
                    href={match.href}
                    className="mt-2 inline-block text-xs text-muted underline decoration-border-strong underline-offset-4 hover:text-accent transition-colors"
                  >
                    Source: {match.source}
                  </Link>
                </>
              ) : (
                <p className="max-w-3xl text-sm leading-relaxed text-foreground">
                  That isn&apos;t on this site, so I won&apos;t guess. Try asking about a role, a project, a city, or a
                  paper.
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <p className="font-mono text-[11px] text-muted">
                  Keyword search over this site&apos;s text, running in your browser. No AI model.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono text-xs text-muted hover:text-accent transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
