import { redirect } from "next/navigation";
import { contact } from "@/data/contact";

export default function ResourcesPage() {
  redirect(contact.resources);
}
