import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { FunctionComponent } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Calendar from "./components/Calendar";
import ComponentStatus from "./components/ComponentStatus";

const App: FunctionComponent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container component={Stack} spacing={2} marginTop={4} marginBottom={4}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            marginBottom: 4,
          }}
        >
          <Typography variant="h1" fontSize={32} flex={1}>
            Some company
          </Typography>

          <Button>Report a problem</Button>
          <Button variant="outlined">Subscribe to updates</Button>
        </Stack>

        <Card
          sx={{
            margin: 0,
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "success.main",
          }}
        >
          <Typography variant="h2" fontSize={18} fontWeight={800}>
            Everything is operational
          </Typography>
        </Card>

        <Card variant="outlined">
          <CardHeader
            title="Message"
            sx={{
              backgroundColor: "divider",
              padding: 2,
            }}
          />

          <CardContent>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Perferendis a eos, sunt ad quam sapiente, unde quisquam alias
            commodi deserunt ratione labore nemo accusantium blanditiis
            reiciendis asperiores necessitatibus. Eaque, inventore.
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader
            title={
              <Stack direction="row" spacing={2} alignItems="center">
                <div
                  style={{
                    marginRight: "auto",
                  }}
                >
                  Platform components
                </div>
                <Typography variant="caption">
                  last updated 2 days ago
                </Typography>
              </Stack>
            }
            sx={{
              backgroundColor: "divider",
              padding: 2,
            }}
          />

          <CardContent component={Stack} spacing={2}>
            <ComponentStatus />
            <Divider />
            <ComponentStatus />
            <Divider />
            <ComponentStatus />
            <Divider />
            <ComponentStatus />
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader
            title="Calendar"
            sx={{
              backgroundColor: "divider",
              padding: 2,
            }}
          />

          <Calendar />
        </Card>

        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Link
            href="https://opsway.io"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                opacity: 0.25,
              }}
            >
              powered by opsway.io
            </Typography>
          </Link>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default App;
