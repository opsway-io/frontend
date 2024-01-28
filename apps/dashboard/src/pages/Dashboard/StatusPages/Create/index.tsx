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

interface StatusPagesDetailViewProps {}

const StatusPagesDetailView: FunctionComponent<
  StatusPagesDetailViewProps
> = () => {
  const copyDNSCNAMEToClipboard = () => {
    navigator.clipboard.writeText("status.opsway.io");

    enqueueSnackbar("Copied DNS CNAME value to clipboard", {
      variant: "success",
    });
  };

  return (
    <>
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
                <TextField label="Name" fullWidth value="status.tranberg.tk" />
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
                <Placeholder />
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

                <TextField
                  label="Logo URL"
                  fullWidth
                  value="https://status.opsway.io/logo.png"
                />
                <TextField
                  label="Logo link"
                  fullWidth
                  value="https://status.opsway.io"
                />
                <TextField
                  label="Favicon URL"
                  fullWidth
                  value="https://status.opsway.io/favicon.ico"
                />
                <TextField label="Title" fullWidth value="status.tranberg.tk" />

                <Divider />

                <Typography variant="subtitle1">Body</Typography>
                <Typography variant="body2" color="text.secondary">
                  The body is the main part of the status page which contains
                  the status of the monitored services.
                </Typography>

                <RadioCardGroup defaultValue="STATS">
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
                <TextField
                  label="Domain"
                  fullWidth
                  value="status.tranberg.tk"
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
                      <code>status.opsway.io</code>
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
                            {
                              "status" // TODO: Replace with actual domain
                            }
                          </TableCell>
                          <TableCell>CNAME</TableCell>
                          <TableCell>status.opsway.io</TableCell>
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

        <Button variant="contained" color="success">
          Create status page
        </Button>
      </Container>
    </>
  );
};

export default StatusPagesDetailView;
