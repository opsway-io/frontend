import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { BiWorld } from "react-icons/bi";
import { BsFillShieldLockFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  CategoryList,
  CategoryListItem,
} from "../../../../components/CategoryList";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";
import { RadioCardGroup, RadioCard } from "../../../../components/RadioCard";
import {
  useStatusPage,
  useUpdateStatusPage,
} from "../../../../hooks/statuspages.query";
import { useMonitors } from "../../../../hooks/monitors.query";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

interface StatusPagesDetailViewProps {}

interface FormValues {
  name: string;
  domain: string;
  logoUrl: string;
  logoLink: string;
  faviconUrl: string;
  layout: string;
  monitorIds: number[];
  customCss: string;
  headerHtml: string;
  footerHtml: string;
  customComponentsHtml: string;
  showBranding: boolean;
  isPrivate: boolean;
  password?: string;
}

const StatusPagesDetailView: FunctionComponent<
  StatusPagesDetailViewProps
> = () => {
  const { id } = useParams<{ id: string }>();
  const statusPageId = parseInt(id || "-1", 10);

  const { data: statusPage, isLoading, error } = useStatusPage(statusPageId);
  const { mutateAsync: updateStatusPage, isLoading: isUpdating } =
    useUpdateStatusPage(statusPageId);

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      domain: "",
      logoUrl: "",
      logoLink: "",
      faviconUrl: "",
      layout: "STATS",
      monitorIds: [],
      customCss: "",
      headerHtml: "",
      footerHtml: "",
      customComponentsHtml: "",
      showBranding: true,
      isPrivate: false,
      password: "",
    },
  });

  const monitorsQuery = useMonitors();

  useEffect(() => {
    if (statusPage) {
      reset({
        name: statusPage.name,
        domain: statusPage.domain,
        logoUrl: statusPage.logoUrl || "",
        logoLink: statusPage.logoLink || "",
        faviconUrl: statusPage.faviconUrl || "",
        layout: statusPage.layout || "STATS",
        monitorIds: statusPage.monitorIds || [],
        customCss: statusPage.customCss || "",
        headerHtml: statusPage.headerHtml || "",
        footerHtml: statusPage.footerHtml || "",
        customComponentsHtml: statusPage.customComponentsHtml || "",
        showBranding: statusPage.showBranding ?? true,
        isPrivate: statusPage.isPrivate || false,
        password: "",
      });
    }
  }, [statusPage, reset]);

  const domain = watch("domain");
  const isPrivate = watch("isPrivate");

  const onSubmit = async (data: FormValues) => {
    try {
      await updateStatusPage(data);
      enqueueSnackbar("Status page updated successfully", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar("Failed to update status page", { variant: "error" });
    }
  };

  const copyDNSCNAMEToClipboard = () => {
    navigator.clipboard.writeText("status.opsway.eu");

    enqueueSnackbar("Copied DNS CNAME value to clipboard", {
      variant: "success",
    });
  };

  if (isLoading) {
    return (
      <Container
        breadcrumbs={[
          <Link to="/status-pages">Status pages</Link>,
          <span>Loading...</span>,
        ]}
      >
        <Placeholder />
      </Container>
    );
  }

  if (error || !statusPage) {
    return (
      <Container
        breadcrumbs={[
          <Link to="/status-pages">Status pages</Link>,
          <span>Error</span>,
        ]}
      >
        <Typography color="error">Error loading status page</Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Status page - {statusPage.name}</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/status-pages">Status pages</Link>,
          <span>{statusPage.name}</span>,
        ]}
      >
        <Card>
          <CardContent>
            <CategoryList>
              <CategoryListItem
                title="Meta"
                description="Meta about the status page only visible to your team not on the page itself."
              >
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label="Name" fullWidth />
                  )}
                />
              </CategoryListItem>
            </CategoryList>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CategoryList>
              <CategoryListItem
                title="Monitors"
                description="The monitors displayed on the status page."
              >
                <Controller
                  name="monitorIds"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="monitors-select-label">
                        Select monitors
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="monitors-select-label"
                        multiple
                        label="Select monitors"
                      >
                        {monitorsQuery.data?.monitors?.map((monitor: any) => (
                          <MenuItem key={monitor.id} value={monitor.id}>
                            {monitor.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </CategoryListItem>
            </CategoryList>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CategoryList>
              <CategoryListItem
                title="Look and feel"
                description="The visual style and components of the status page."
              >
                <Typography variant="subtitle1">Header</Typography>
                <Typography variant="body2" color="text.secondary">
                  The header is the top part of the status page which contains
                  the logo and title.
                </Typography>

                <Controller
                  name="logoUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Logo URL" fullWidth />
                  )}
                />
                <Controller
                  name="logoLink"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Logo link" fullWidth />
                  )}
                />
                <Controller
                  name="faviconUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Favicon URL" fullWidth />
                  )}
                />

                <Divider />

                <Typography variant="subtitle1">Body</Typography>
                <Typography variant="body2" color="text.secondary">
                  The body is the main part of the status page which contains
                  the status of the monitored services.
                </Typography>

                <Controller
                  name="layout"
                  control={control}
                  render={({ field }) => (
                    <RadioCardGroup
                      defaultValue="STATS"
                      value={field.value}
                      onChange={(e: any) => field.onChange(e.target.value)}
                    >
                      <RadioCard
                        label="All the stats!"
                        value="STATS"
                        description="This will show all the stats on the status page available."
                      />
                      <RadioCard
                        label="Compact"
                        value="COMPACT"
                        description="This will show only the most important stats on the status page in a compact way."
                      />
                      <RadioCard
                        label="Simple"
                        value="SIMPLE"
                        description="This will show only the name and operational status in a simple way."
                      />
                    </RadioCardGroup>
                  )}
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1">Branding & CSS</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Customize the branding and inject custom HTML/CSS styles on
                  your status page.
                </Typography>

                <Controller
                  name="showBranding"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          color="success"
                        />
                      }
                      label="Show Opsway Branding"
                      sx={{ mb: 2, display: "block" }}
                    />
                  )}
                />

                <Stack spacing={3}>
                  <Controller
                    name="customCss"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Custom CSS overrides"
                        multiline
                        rows={4}
                        placeholder="/* Add your custom styles here */"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="headerHtml"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Custom Header HTML"
                        multiline
                        rows={3}
                        placeholder="<!-- Custom header banner, scripts, or meta tags -->"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="footerHtml"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Custom Footer HTML"
                        multiline
                        rows={3}
                        placeholder="<!-- Custom footer links, scripts, etc. -->"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="customComponentsHtml"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Custom Components HTML"
                        multiline
                        rows={4}
                        placeholder="<!-- Add any HTML components here -->"
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </CategoryListItem>
            </CategoryList>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CategoryList>
              <CategoryListItem
                title="Custom domain"
                description="You can use a custom domain to host your status page instead of the default one."
              >
                <Controller
                  name="domain"
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message:
                        "Must be a valid fully-qualified domain name (e.g. status.example.com)",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Domain"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error
                          ? fieldState.error.message
                          : "Enter your fully-qualified domain name (e.g. status.example.com). Do not enter just the subdomain."
                      }
                    />
                  )}
                />

                <Card elevation={4}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      margin: 2,
                      marginBottom: 0,
                    }}
                  >
                    <BiWorld />
                    <Typography>DNS records</Typography>
                  </Stack>

                  <CardContent>
                    <Typography>
                      You need to add a CNAME record to your DNS provider which
                      points to:
                    </Typography>

                    <Typography
                      sx={{
                        marginTop: 1,
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                      onClick={copyDNSCNAMEToClipboard}
                    >
                      <code>status.opsway.eu</code>
                    </Typography>

                    <Typography sx={{ marginTop: 1 }}>
                      Example if you are using Cloudflare, you can use the
                      following DNS record:
                    </Typography>

                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Host</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>TTL</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {domain ? domain.split(".")[0] : "status"}
                          </TableCell>
                          <TableCell>CNAME</TableCell>
                          <TableCell>status.opsway.eu</TableCell>
                          <TableCell>Automatic</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card elevation={4}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      margin: 2,
                      marginBottom: 0,
                    }}
                  >
                    <BsFillShieldLockFill />
                    <Typography>SSL certificate</Typography>
                  </Stack>

                  <CardContent>
                    <Typography>
                      The first time you visit your status page, we will
                      automatically issue a SSL certificate for it. This may
                      take a few minutes.
                    </Typography>
                    <Typography>
                      The SSL certificate is provided by{" "}
                      <MuiLink href="https://letsencrypt.org/" target="_blank">
                        Let's Encrypt
                      </MuiLink>{" "}
                      and is automatically renewed.
                    </Typography>
                  </CardContent>
                </Card>
              </CategoryListItem>
            </CategoryList>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CategoryList>
              <CategoryListItem
                title="Privacy & protection"
                description="Restrict who can view your status page by enabling password protection."
              >
                <Controller
                  name="isPrivate"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          color="success"
                        />
                      }
                      label="Password Protection Enabled"
                      sx={{ mb: isPrivate ? 2 : 0, display: "block" }}
                    />
                  )}
                />

                {isPrivate && (
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        label="Status Page Password"
                        placeholder="Leave blank to keep existing password"
                        fullWidth
                      />
                    )}
                  />
                )}
              </CategoryListItem>
            </CategoryList>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit(onSubmit)}
          disabled={isUpdating}
        >
          Update status page
        </Button>
      </Container>
    </>
  );
};

export default StatusPagesDetailView;
