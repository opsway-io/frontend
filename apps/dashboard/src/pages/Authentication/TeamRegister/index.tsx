import { Card, CardContent, Fade, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Placeholder from "../../../components/Placeholder";
import TeamRegistrationForm from "./form";

interface TeamRegisterViewProps {}

const TeamRegisterView: FunctionComponent<TeamRegisterViewProps> = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Team creation</title>
      </Helmet>

      <Fade in={true} appear timeout={250}>
        <Card
          elevation={1}
          sx={{
            flex: 1,
            maxWidth: 500,
          }}
        >
          <CardContent
            component={Stack}
            spacing={2}
            sx={{
              marginTop: 2,
              margin: 1,
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              sx={{
                fontWeight: 700,
              }}
            >
              Lets create a new team!
            </Typography>

            <TeamRegistrationForm />
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default TeamRegisterView;
