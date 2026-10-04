export function excerpt(text: string | null | undefined, maxLength = 140): string | null {
  const clean = text?.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  if (clean.length <= maxLength) return clean;

  const sentence = /^.*?[.!?](?=\s|$)/.exec(clean)?.[0];
  if (sentence && sentence.length <= maxLength) return sentence;

  const cut = clean.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const kept = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${kept.replace(/[,;:.]+$/, "")}...`;
}
