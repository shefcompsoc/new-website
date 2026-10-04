import { Brand } from "./brand";
import { SiteNavigation } from "./site-navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-width header-inner">
        <Brand />
        <SiteNavigation />
      </div>
    </header>
  );
}
