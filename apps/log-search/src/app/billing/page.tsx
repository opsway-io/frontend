import { redirect } from "next/navigation";

export default function LogSearchBillingRedirectPage() {
  redirect("/?view=billing");
}
