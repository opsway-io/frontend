import { redirect } from "next/navigation";

export default function LogSearchTeamRedirectPage() {
  redirect("/?view=team");
}
