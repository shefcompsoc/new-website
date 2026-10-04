export function PageHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {description && <p className="page-intro">{description}</p>}
    </header>
  );
}
