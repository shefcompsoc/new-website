"use client";
import { useState } from "react";

export function CopyFeed({ url }: { url: string }) {
  const [message, setMessage] = useState("");
  return (
    <div className="feed-copy">
      <label htmlFor="feed-url">Or copy the calendar address</label>
      <div>
        <input id="feed-url" readOnly value={url} onFocus={(e) => e.target.select()} />
        <button
          className="button button-secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setMessage("Calendar address copied.");
            } catch {
              setMessage("Select the address above and copy it manually.");
            }
          }}
        >
          Copy URL
        </button>
      </div>
      <p role="status" className="copy-status">
        {message}
      </p>
    </div>
  );
}
