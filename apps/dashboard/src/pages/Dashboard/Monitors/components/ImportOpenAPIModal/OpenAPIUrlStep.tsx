import { FormControl, FormLabel, Input, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";

interface OpenAPIUrlStepProps {
  url: string;
  onUrlChange: (url: string) => void;
}

const OpenAPIUrlStep: FunctionComponent<OpenAPIUrlStepProps> = (props) => {
  return (
    <Stack spacing={2}>
      <Typography level="body-sm" textColor="text.secondary">
        Provide a public URL to your OpenAPI (Swagger){" "}
        <Typography fontFamily="code">openapi.json</Typography> file. We will
        parse the endpoints, expected status codes, and request bodies.
      </Typography>
      <FormControl>
        <FormLabel>OpenAPI URL</FormLabel>
        <Input
          value={props.url}
          onChange={(e) => props.onUrlChange(e.target.value)}
          placeholder="https://api.example.com/openapi.json"
          // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of a dialog
          autoFocus
        />
      </FormControl>
    </Stack>
  );
};

export default OpenAPIUrlStep;
