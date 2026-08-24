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
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { BiWorld } from "react-icons/bi";
import { BsFillShieldLockFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  CategoryList,
  CategoryListItem,
} from "../../../../components/CategoryList";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";
import { RadioCardGroup, RadioCard } from "../../../../components/RadioCard";

import { useCreateStatusPage } from "../../../../hooks/statuspages.query";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UpgradePromptModal from "../../../../components/UpgradePromptModal";
import { isAxiosError } from "axios";
import { useState } from "react";

interface StatusPagesCreateViewProps {}

interface FormValues {
  name: string;
  domain: string;
}

const StatusPagesCreateView: FunctionComponent<
  StatusPagesCreateViewProps
> = () => {
  const navigate = useNavigate();
  const { mutateAsync: createStatusPage, isLoading } = useCreateStatusPage();
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  const domain = watch("domain");

  const onSubmit = async (data: FormValues) => {
    try {
      const sp = await createStatusPage(data);
      enqueueSnackbar("Status page created successfully", {
        variant: "success",
      });
      navigate(`/status-pages/${sp.id}`);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 402) {
        setOpenUpgradeModal(true);
      } else {
        enqueueSnackbar("Failed to create status page", { variant: "error" });
      }
    }
  };

  const copyDNSCNAMEToClipboard = () => {
    navigator.clipboard.writeText("status.opsway.eu");

    enqueueSnackbar("Copied DNS CNAME value to clipboard", {
      variant: "success",
    });
  };

  return (
    <>
      <UpgradePromptModal
        open={openUpgradeModal}
        onClose={() => setOpenUpgradeModal(false)}
        featureName="Status Pages"
      />
      <Helmet>
        <title>Status pages</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/status-pages">Status pages</Link>,
          <span>Create</span>,
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
                title="Custom domain"
                description="You can use a custom domain to host your status page instead of the default one."
              >
                <Controller
                  name="domain"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label="Domain" fullWidth />
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

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          Create status page
        </Button>
      </Container>
    </>
  );
};

export default StatusPagesCreateView;
