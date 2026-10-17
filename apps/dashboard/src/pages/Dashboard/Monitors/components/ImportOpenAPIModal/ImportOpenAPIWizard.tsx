import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@mui/joy";
import { useSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { isAxiosError } from "axios";
import { PreviewOpenAPIEndpoint } from "../../../../../api/endpoints/monitors";
import {
  DialogActions,
  DialogContent,
} from "../../../../../components/Dialog/Dialog";
import {
  useCreateMonitorsBulk,
  usePreviewOpenAPI,
} from "../../../../../hooks/monitors.query";
import { useLocations } from "../../../../../hooks/prober.query";
import { getErrorMessage } from "../../../../../utilities/errors";
import {
  buildImportRequest,
  emptyImportAuth,
  getOrigin,
  ImportAuth,
} from "./buildImportRequest";
import ImportAuthFields from "./ImportAuthFields";
import ImportLocationPicker from "./ImportLocationPicker";
import OpenAPIEndpointList from "./OpenAPIEndpointList";
import OpenAPIUrlStep from "./OpenAPIUrlStep";

interface ImportOpenAPIWizardProps {
  onClose: () => void;
}

/**
 * Two step import: fetch the spec preview, then pick endpoints and options.
 * Rendered inside the dialog so all state resets when it closes.
 */
const ImportOpenAPIWizard: FunctionComponent<ImportOpenAPIWizardProps> = ({
  onClose,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const previewMutation = usePreviewOpenAPI();
  const importMutation = useCreateMonitorsBulk();
  const { data: locationsData } = useLocations();
  const availableLocations = locationsData?.locations || [];

  const [url, setUrl] = useState("");
  const [endpoints, setEndpoints] = useState<PreviewOpenAPIEndpoint[] | null>(
    null,
  );
  const [selectedEndpoints, setSelectedEndpoints] = useState<number[]>([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [groupAsSingle, setGroupAsSingle] = useState(false);
  const [validateBodyFields, setValidateBodyFields] = useState(true);
  const [auth, setAuth] = useState<ImportAuth>(emptyImportAuth);
  const [selectedLocations, setSelectedLocations] = useState(["global"]);

  const fetchEndpoints = () =>
    previewMutation.mutate(url, {
      onSuccess: (preview) => {
        setEndpoints(preview.endpoints);
        setSelectedEndpoints(preview.endpoints.map((_, index) => index));
        // Endpoint paths already contain the API base path, so only the
        // origin of the server URL is prepended.
        setBaseUrl(getOrigin(preview.baseUrl) || getOrigin(url));
        setAuth({
          ...emptyImportAuth,
          method: preview.auth?.method ?? "NONE",
          tokenUrl: preview.auth?.tokenUrl ?? "",
        });
      },
      onError: (error) =>
        enqueueSnackbar(
          getErrorMessage(
            error,
            "Failed to parse OpenAPI spec from the provided URL.",
          ),
          { variant: "error" },
        ),
    });

  const importMonitors = () => {
    if (!endpoints) {
      return;
    }

    const request = buildImportRequest({
      endpoints: selectedEndpoints.map((index) => endpoints[index]),
      baseUrl,
      specUrl: url,
      groupAsSingle,
      validateBodyFields,
      auth,
      locations: selectedLocations,
    });

    importMutation.mutate(request, {
      onSuccess: () => {
        enqueueSnackbar(
          `Successfully imported ${request.monitors.length} monitors!`,
          { variant: "success" },
        );
        onClose();
      },
      onError: (error) => {
        const message =
          isAxiosError(error) && error.response?.status === 402
            ? "You have reached your plan limit for monitors."
            : getErrorMessage(error, "Failed to import monitors.");
        enqueueSnackbar(message, { variant: "error" });
      },
    });
  };

  const toggleEndpoint = (index: number) =>
    setSelectedEndpoints((selected) =>
      selected.includes(index)
        ? selected.filter((i) => i !== index)
        : [...selected, index],
    );

  return (
    <>
      <DialogContent>
        {endpoints === null ? (
          <OpenAPIUrlStep url={url} onUrlChange={setUrl} />
        ) : (
          <Stack spacing={2}>
            <Alert
              color="info"
              variant="soft"
              startDecorator={<IoInformationCircleOutline size={18} />}
            >
              Discovered {endpoints.length} endpoints. Select the ones you want
              to monitor.
            </Alert>

            <FormControl>
              <FormLabel>Base URL</FormLabel>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
              <FormHelperText>
                This URL will be prepended to all imported endpoint paths.
              </FormHelperText>
            </FormControl>

            <OpenAPIEndpointList
              endpoints={endpoints}
              selected={selectedEndpoints}
              onToggle={toggleEndpoint}
              validateBodyFields={validateBodyFields}
            />

            <Checkbox
              size="sm"
              checked={validateBodyFields}
              onChange={(e) => setValidateBodyFields(e.target.checked)}
              label="Validate response body fields (assertions from schema)"
            />

            <Checkbox
              size="sm"
              checked={groupAsSingle}
              onChange={(e) => setGroupAsSingle(e.target.checked)}
              label="Group into a single multi-step monitor"
            />

            {auth.method !== "NONE" && (
              <ImportAuthFields auth={auth} onChange={setAuth} />
            )}

            {availableLocations.length > 0 && (
              <ImportLocationPicker
                locations={availableLocations}
                selected={selectedLocations}
                onChange={setSelectedLocations}
              />
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="plain" color="neutral" onClick={onClose}>
          Cancel
        </Button>
        {endpoints === null ? (
          <Button
            onClick={fetchEndpoints}
            disabled={!url}
            loading={previewMutation.isPending}
          >
            Fetch Endpoints
          </Button>
        ) : (
          <Button
            onClick={importMonitors}
            disabled={selectedEndpoints.length === 0}
            loading={importMutation.isPending}
          >
            Import{" "}
            {groupAsSingle
              ? "1 Monitor"
              : `${selectedEndpoints.length} Monitors`}
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default ImportOpenAPIWizard;
