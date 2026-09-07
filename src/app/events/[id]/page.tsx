export default async function EventPage({
  params,
}: PageProps<"/events/[id]">) {
  const { id } = await params;
  return <h1 className="p-8 text-2xl font-semibold">Event {id}</h1>;
}
