import { redirect } from "next/navigation";

export default function LogSearchSettingsRedirectPage() {
  redirect("/?view=settings&tab=general");
}
