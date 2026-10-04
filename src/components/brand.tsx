import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Sheffield CompSoc home">
      <span className="brand-icon">
        <Image src="/brand/kevin.png" alt="" width={80} height={80} priority />
      </span>
      <span className="brand-name">
        Sheffield<span>CompSoc</span>
      </span>
    </Link>
  );
}
