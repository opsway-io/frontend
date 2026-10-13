import { Divider } from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, useWatch } from "react-hook-form";
import CodeSnippet from "../../../../../components/CodeSnippet/CodeSnippet";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import SettingsSubheader from "../../../../../components/SettingsCard/SettingsSubheader";
import { StatusPageFormValues } from "../../statusPageForm";

interface EmbedsSectionProps {
  control: Control<StatusPageFormValues>;
}

const EmbedsSection: FunctionComponent<EmbedsSectionProps> = ({ control }) => {
  const domain = useWatch({ control, name: "domain" });
  const publicBaseUrl = `${window.location.origin}/v1/public/status-pages/${domain || "domain"}`;

  return (
    <SettingsCard
      title="Embeds & Badges"
      description="Embed real-time status badges in your README or display an in-app banner widget during active incidents."
    >
      <SettingsSubheader
        title="Live Status Badge (SVG)"
        description="Display an up-to-date status badge in your markdown documents, GitHub README, or website header."
      />
      <CodeSnippet
        label="Markdown Badge"
        code={`[![Status](${publicBaseUrl}/badge.svg)](${publicBaseUrl})`}
        copyMessage="Copied markdown badge to clipboard"
      />
      <CodeSnippet
        label="HTML Embed"
        code={`<img src="${publicBaseUrl}/badge.svg" alt="Status" />`}
        copyMessage="Copied HTML embed to clipboard"
      />

      <Divider />

      <SettingsSubheader
        title="In-App Status Banner Widget"
        description="Add this script to your web app's HTML <head> or <body>. It will automatically display a notice banner at the top of your app whenever an incident or maintenance is active."
      />
      <CodeSnippet
        label="JavaScript Snippet"
        code={`<script src="${publicBaseUrl}/widget.js" async></script>`}
        copyMessage="Copied widget snippet to clipboard"
      />
    </SettingsCard>
  );
};

export default EmbedsSection;
