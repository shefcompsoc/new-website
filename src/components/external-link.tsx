import type { AnchorHTMLAttributes } from "react";

const ownHosts = ["shefcompsoc.uk", "www.shefcompsoc.uk"];

export function isExternal(href: string) {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return !ownHosts.includes(new URL(href).host.toLowerCase());
  } catch {
    return false;
  }
}

export function ExternalLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const away = isExternal(href);
  return (
    <a
      href={href}
      target={away ? "_blank" : undefined}
      rel={away ? "noreferrer noopener" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
