import { FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { ImportAuth } from "./buildImportRequest";
import ImportOptionsSection from "./ImportOptionsSection";

type CredentialField = Exclude<keyof ImportAuth, "method">;

interface CredentialInput {
  field: CredentialField;
  label: string;
  type?: "password";
}

const oauthCredentials: CredentialInput[] = [
  { field: "clientId", label: "Client ID" },
  { field: "clientSecret", label: "Client Secret", type: "password" },
];

const basicCredentials: CredentialInput[] = [
  { field: "username", label: "Username" },
  { field: "password", label: "Password", type: "password" },
];

interface ImportAuthFieldsProps {
  auth: ImportAuth;
  onChange: (auth: ImportAuth) => void;
}

/** Credentials applied to all imported monitors when the spec requires auth. */
const ImportAuthFields: FunctionComponent<ImportAuthFieldsProps> = ({
  auth,
  onChange,
}) => {
  const renderInput = (input: CredentialInput) => (
    <FormControl key={input.field} sx={{ flex: 1 }}>
      <FormLabel>{input.label}</FormLabel>
      <Input
        type={input.type}
        value={auth[input.field]}
        onChange={(e) => onChange({ ...auth, [input.field]: e.target.value })}
      />
    </FormControl>
  );

  const credentials =
    auth.method === "BASIC" ? basicCredentials : oauthCredentials;

  return (
    <ImportOptionsSection
      title="Global Authentication Settings"
      description="The backend detected that this API requires authentication. These credentials will be applied to all imported monitors."
    >
      <Stack spacing={2}>
        {auth.method === "OAUTH2_CLIENT_CREDENTIALS" &&
          renderInput({ field: "tokenUrl", label: "Token Endpoint URL" })}
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          {credentials.map(renderInput)}
        </Stack>
      </Stack>
    </ImportOptionsSection>
  );
};

export default ImportAuthFields;
