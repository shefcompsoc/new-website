import Image from "next/image";

export function RecognitionGrid({
  records,
  kind,
}: {
  records: { id: string; name: string; imageUrl: string | null }[];
  kind: "Sponsor" | "Award";
}) {
  return (
    <div className="recognition-grid">
      {records.map((record) => (
        <article className="recognition-card" key={record.id}>
          <div className={`recognition-art${kind === "Award" ? " award-art" : ""}`}>
            {record.imageUrl ? (
              <Image
                src={record.imageUrl}
                alt={record.name}
                width={480}
                height={320}
                sizes="(max-width: 760px) 100vw, 33vw"
              />
            ) : (
              <span aria-hidden="true">{kind === "Award" ? "[*]" : record.name}</span>
            )}
          </div>
          <div className="event-card-body">
            <span className="eyebrow">
              {kind === "Sponsor" ? "Society partner" : "Activity Awards"}
            </span>
            <h2>{record.name}</h2>
          </div>
        </article>
      ))}
    </div>
  );
}
