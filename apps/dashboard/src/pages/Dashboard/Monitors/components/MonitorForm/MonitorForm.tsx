import { Box, Tab, TabList, Tabs } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { FormProvider, UseFormReturn, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { MonitorFormData } from "../../models/monitorFormData";
import { methodsWithoutTLS } from "../../models/requestOptions";
import AuthSettings from "./AuthSettings";
import FrequencyAndLocationSettings from "./FrequencyAndLocationSettings";
import MonitorFormHeader from "./MonitorFormHeader";
import StepsSettings from "./StepsSettings";
import TLSVerificationSettings from "./TLSVerificationSettings";

interface MonitorFormTab {
  value: string;
  label: string;
  content: ReactNode;
}

const tabs: MonitorFormTab[] = [
  { value: "steps", label: "Steps", content: <StepsSettings /> },
  {
    value: "frequencyAndLocation",
    label: "Frequency & Location",
    content: <FrequencyAndLocationSettings />,
  },
  {
    value: "authentication",
    label: "Authentication",
    content: <AuthSettings />,
  },
  {
    value: "tlsVerification",
    label: "SSL/TLS",
    content: <TLSVerificationSettings />,
  },
];

interface MonitorFormProps {
  form: UseFormReturn<MonitorFormData>;
  submitLabel: ReactNode;
  submitIcon?: ReactNode;
  submitting: boolean;
  submitDisabled: boolean;
  onSubmit: () => void;
}

/**
 * The monitor create/settings form: name + submit button and tabs for
 * steps, frequency & location, authentication and SSL/TLS.
 * All tabs stay mounted (hidden) so every field is validated.
 */
const MonitorForm: FunctionComponent<MonitorFormProps> = ({
  form,
  ...headerProps
}) => {
  const [searchParams, setSearchParams] = useSearchParams({ tab: "steps" });
  const selectedTab = searchParams.get("tab");

  const firstStepMethod = useWatch({
    control: form.control,
    name: "steps.0.method",
  });
  const showTLSTab = !methodsWithoutTLS.includes(firstStepMethod);
  const visibleTabs = tabs.filter(
    (tab) => showTLSTab || tab.value !== "tlsVerification",
  );

  return (
    <FormProvider {...form}>
      <MonitorFormHeader {...headerProps} />

      <Tabs
        value={selectedTab}
        onChange={(_, value) => setSearchParams({ tab: String(value) })}
      >
        <TabList>
          {visibleTabs.map((tab) => (
            <Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {tabs.map((tab) => (
        <Box
          key={tab.value}
          sx={{ display: selectedTab === tab.value ? "block" : "none" }}
        >
          {tab.content}
        </Box>
      ))}
    </FormProvider>
  );
};

export default MonitorForm;
