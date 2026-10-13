import {
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller } from "react-hook-form";
import {
  RadioCard,
  RadioCardGroup,
} from "../../../../../components/RadioCard/RadioCard";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import SettingsSubheader from "../../../../../components/SettingsCard/SettingsSubheader";
import { DEFAULT_LAYOUT, StatusPageFormValues } from "../../statusPageForm";
import SwitchField from "./SwitchField";

const urlFields: {
  name: "logoUrl" | "logoLink" | "faviconUrl" | "supportUrl";
  label: string;
  placeholder: string;
  helperText?: string;
}[] = [
  { name: "logoUrl", label: "Logo URL", placeholder: "https://" },
  { name: "logoLink", label: "Logo link", placeholder: "https://" },
  { name: "faviconUrl", label: "Favicon URL", placeholder: "https://" },
  {
    name: "supportUrl",
    label: "Support URL",
    placeholder: "mailto:support@example.com",
    helperText: "E.g. mailto:support@example.com or a link to your help desk.",
  },
];

const layouts = [
  {
    value: "STATS",
    label: "All the stats!",
    description: "This will show all the stats on the status page available.",
  },
  {
    value: "COMPACT",
    label: "Compact",
    description:
      "This will show only the most important stats on the status page in a compact way.",
  },
  {
    value: "SIMPLE",
    label: "Simple",
    description:
      "This will show only the name and operational status in a simple way.",
  },
];

const codeFields: {
  name: "customCss" | "headerHtml" | "footerHtml" | "customComponentsHtml";
  label: string;
  placeholder: string;
  minRows: number;
}[] = [
  {
    name: "customCss",
    label: "Custom CSS overrides",
    placeholder: "/* Add your custom styles here */",
    minRows: 4,
  },
  {
    name: "headerHtml",
    label: "Custom Header HTML",
    placeholder: "<!-- Custom header banner, scripts, or meta tags -->",
    minRows: 3,
  },
  {
    name: "footerHtml",
    label: "Custom Footer HTML",
    placeholder: "<!-- Custom footer links, scripts, etc. -->",
    minRows: 3,
  },
  {
    name: "customComponentsHtml",
    label: "Custom Components HTML",
    placeholder: "<!-- Add any HTML components here -->",
    minRows: 4,
  },
];

interface LookAndFeelSectionProps {
  control: Control<StatusPageFormValues>;
}

const LookAndFeelSection: FunctionComponent<LookAndFeelSectionProps> = ({
  control,
}) => (
  <SettingsCard
    title="Look and feel"
    description="The visual style and components of the status page."
  >
    <SettingsSubheader
      title="Header"
      description="The header is the top part of the status page which contains the logo and title."
    />

    {urlFields.map(({ name, label, placeholder, helperText }) => (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input {...field} placeholder={placeholder} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        )}
      />
    ))}

    <Divider />

    <SettingsSubheader
      title="Body"
      description="The body is the main part of the status page which contains the status of the monitored services."
    />

    <Controller
      name="layout"
      control={control}
      render={({ field }) => (
        <RadioCardGroup
          defaultValue={DEFAULT_LAYOUT}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        >
          {layouts.map((layout) => (
            <RadioCard key={layout.value} {...layout} />
          ))}
        </RadioCardGroup>
      )}
    />

    <Divider />

    <SettingsSubheader
      title="Branding & CSS"
      description="Customize the branding and inject custom HTML/CSS styles on your status page."
    />

    <SwitchField
      control={control}
      name="showBranding"
      label="Show Opsway Branding"
    />

    {codeFields.map(({ name, label, placeholder, minRows }) => (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel>{label}</FormLabel>
            <Textarea
              {...field}
              minRows={minRows}
              placeholder={placeholder}
              sx={{ fontFamily: "code", fontSize: "sm" }}
            />
          </FormControl>
        )}
      />
    ))}
  </SettingsCard>
);

export default LookAndFeelSection;
