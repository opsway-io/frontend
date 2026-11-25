import { redirect } from "next/navigation";

export default function LogSearchInfoRedirectPage() {
  redirect("/?view=guide");
}
