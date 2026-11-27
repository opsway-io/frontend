import { redirect } from "next/navigation";

const VALID_TABS = new Set(["general", "integrations", "api-keys", "ai-agent"]);

export default async function LogSearchSettingsTabRedirectPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  if (tab === "billing" || tab === "usage") {
    redirect("/?view=billing");
  }
  if (VALID_TABS.has(tab)) {
    redirect(`/?view=settings&tab=${tab}`);
  }
  redirect("/?view=settings&tab=general");
}
