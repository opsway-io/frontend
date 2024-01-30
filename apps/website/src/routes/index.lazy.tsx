import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { IoLogoGithub, IoMdAlert, IoMdPulse } from "react-icons/io";
import { IoPlay, IoRocket } from "react-icons/io5";
import { PiWebhooksLogoBold } from "react-icons/pi";
import { VscLayers } from "react-icons/vsc";
import { FaHeart } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import Spacer from "../components/Spacer";
import { Helmet } from "react-helmet";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const t = useTheme();

  return (
    <>
      <Helmet>
        <title>opsway.io</title>
        <meta
          name="keywords"
          content="opsway, opsway.io, status page, incident management, changelogs, real-time monitoring"
        />
      </Helmet>

      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 48,
              md: 80,
            },
            color: (t) => t.palette.success.main,
            fontWeight: 700,
            display: "inline",
            lineHeight: 1.2,
            backgroundImage: (t) =>
              `linear-gradient(45deg, ${t.palette.success.main}, ${t.palette.info.main})`,
            backgroundClip: "text",
            textFillColor: "transparent",
          }}
        >
          Open Source Operations
        </Typography>

        <br />

        <Typography
          sx={{
            fontSize: {
              xs: 20,
              md: 36,
            },
            color: (t) => t.palette.text.secondary,
            fontWeight: 300,
            display: "inline",
          }}
        >
          If something breaks, we'll let you know.
        </Typography>
      </Box>

      <Spacer />

      <Container maxWidth="xl">
        <Stack
          spacing={2}
          justifyContent="center"
          direction={{
            xs: "column",
            md: "row",
          }}
        >
          <Button
            variant="outlined"
            color="success"
            href="https://my.opsway.io/login"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              minWidth: 200,
            }}
            endIcon={<IoPlay />}
          >
            Get started
          </Button>

          <Button
            variant="outlined"
            color="primary"
            href="https://github.com/opsway-io"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              minWidth: 200,
            }}
            endIcon={<IoLogoGithub />}
          >
            GitHub
          </Button>
        </Stack>

        <Spacer />

        <Stack
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginBottom: 4,
              opacity: 0.5,
            }}
          >
            All you need is here
          </Typography>

          <Grid
            container
            direction={{
              xs: "column",
              md: "row",
            }}
            gap={2}
            sx={{
              padding: 0,
              "& .MuiCard-root": {
                textAlign: "left",
                flex: 1,
              },
            }}
          >
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ backgroundColor: (t) => t.palette.success.main }}
                    >
                      <IoMdPulse />
                    </Avatar>
                    <Typography variant="h6">Real-time monitoring</Typography>
                  </Stack>

                  <Typography>
                    We monitor your websites and services in real-time and alert
                    you when something goes wrong.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ backgroundColor: (t) => t.palette.warning.main }}
                    >
                      <IoMdAlert />
                    </Avatar>
                    <Typography variant="h6">Incident management</Typography>
                  </Stack>

                  <Typography>
                    We help you to manage incidents and keep your team
                    up-to-date with the latest status.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ backgroundColor: (t) => t.palette.text.primary }}
                    >
                      <CgWebsite />
                    </Avatar>
                    <Typography variant="h6">Status page</Typography>
                  </Stack>

                  <Typography>
                    We help you to keep your customers up-to-date with the
                    latest status.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ backgroundColor: (t) => t.palette.info.main }}
                    >
                      <VscLayers />
                    </Avatar>
                    <Typography variant="h6">Changelogs</Typography>
                  </Stack>

                  <Typography>
                    We help you to keep your customers up-to-date with the
                    latest changes.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </Container>

      <Spacer />

      <Container maxWidth="xl">
        <Stack
          sx={{
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginBottom: 4,
              opacity: 0.5,
            }}
          >
            Alerts through the channels you already use
          </Typography>

          <Grid
            container
            direction={{
              xs: "column",
              md: "row",
            }}
            gap={2}
            sx={{
              padding: 0,
              "& .MuiCard-root": {
                textAlign: "left",
                flex: 1,
              },
            }}
          >
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      height={42}
                      src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg"
                      alt="Slack"
                    />
                    <Typography variant="h6">Slack</Typography>
                  </Stack>

                  <Typography>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus, qui! Sunt, suscipit tempore.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      height={42}
                      src="https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg"
                      alt="Microsoft Teams"
                    />
                    <Typography variant="h6">Microsoft Teams</Typography>
                  </Stack>

                  <Typography>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus, qui! Sunt, suscipit tempore.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      height={42}
                      src="https://cdn.worldvectorlogo.com/logos/discord.svg"
                      alt="Discord"
                    />
                    <Typography variant="h6">Discord</Typography>
                  </Stack>

                  <Typography>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus, qui! Sunt, suscipit tempore.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PiWebhooksLogoBold size={42} />
                    <Typography variant="h6">Webhooks</Typography>
                  </Stack>

                  <Typography>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus, qui! Sunt, suscipit tempore.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </Container>

      <Spacer />

      <Container maxWidth="xl">
        <Divider sx={{ opacity: 0.05, marginBottom: 4 }} />

        <Stack
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: 4,
              opacity: 0.5,
            }}
          >
            Companies of all sizes{" "}
            <FaHeart
              color={t.palette.error.main}
              style={{
                verticalAlign: "middle",
              }}
            />{" "}
            opsway
          </Typography>

          <Grid
            container
            direction="row"
            spacing={{
              xs: 4,
              md: 8,
            }}
            justifyContent="center"
            sx={{
              padding: 0,
              opacity: 0.5,

              "& img": {
                filter: "brightness(0) invert(1)",

                "&:hover": {
                  filter: "brightness(1.5) invert(0)",
                },
              },
            }}
          >
            <Grid item>
              <img
                height={32}
                src="https://cdn.worldvectorlogo.com/logos/airbnb-2.svg"
                alt="Airbnb"
              />
            </Grid>

            <Grid item>
              <img
                height={32}
                src="https://cdn.worldvectorlogo.com/logos/spotify-2.svg"
                alt="Spotify"
              />
            </Grid>

            <Grid item>
              <img
                height={32}
                src="https://cdn.worldvectorlogo.com/logos/coinbase.svg"
                alt="Coinbase"
              />
            </Grid>

            <Grid item>
              <img
                height={32}
                src="https://cdn.worldvectorlogo.com/logos/lyft.svg"
                alt="Lyft"
              />
            </Grid>

            <Grid item>
              <img
                height={32}
                src="https://cdn.worldvectorlogo.com/logos/plex.svg"
                alt="Plex"
              />
            </Grid>

            <Grid item>
              <img
                height={32}
                src="https://cdn.worldvectorlogo.com/logos/unity-69.svg"
                alt="Unity"
              />
            </Grid>

            <Grid item>
              <img
                height={32}
                src="https://cdn.worldvectorlogo.com/logos/zendesk.svg"
                alt="Zendesk"
              />
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ opacity: 0.05, marginTop: 4 }} />
      </Container>

      <Spacer />

      <Box
        sx={{
          textAlign: "center",
          padding: 4,
        }}
      >
        <img
          src="img/logo.svg"
          alt="logo"
          style={{ height: 42, marginBottom: 24 }}
        />

        <Typography variant="h5">Get started today</Typography>

        <Typography
          variant="subtitle1"
          sx={{
            marginBottom: 4,
          }}
          color="text.secondary"
        >
          Start monitoring your websites and services today.
        </Typography>

        <Button
          variant="outlined"
          size="large"
          color="success"
          href="https://my.opsway.io/login/register"
          endIcon={<IoRocket />}
        >
          Register now, it's free!
        </Button>
      </Box>
    </>
  );
}
