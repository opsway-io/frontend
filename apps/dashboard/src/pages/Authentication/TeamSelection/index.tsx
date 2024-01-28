import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Fade,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Conditional from "../../../components/Conditional";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useUserTeams } from "../../../hooks/user.query";
import { stringToInitials } from "../../../utilities/names";

interface TeamSelectionViewProps {}

const TeamSelectionView: FunctionComponent<TeamSelectionViewProps> = () => {
  const navigate = useNavigate();
  const authentication = useAuthenticationStore();
  const { data, isLoading } = useUserTeams(authentication.currentUserId);

  const handleTeamSelect = (teamId: number) => {
    authentication.setCurrentTeamID(teamId);
    navigate("/monitors", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Team selection</title>
      </Helmet>

      <Fade in={true} appear timeout={250}>
        <Box>
          <Card
            elevation={1}
            sx={{
              flex: 1,
              width: 500,
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
                Select a team to continue
              </Typography>

              <Conditional value={!isLoading}>
                {data?.teams?.length !== 0 && (
                  <List
                    sx={{
                      maxHeight: 600,
                      overflow: "auto",
                    }}
                  >
                    {data?.teams?.map((team) => (
                      <TeamListItem
                        key={team.id}
                        name={team.name}
                        role={team.role}
                        avatarUrl={team.avatarUrl}
                        onClick={() => handleTeamSelect(team.id)}
                      />
                    ))}
                  </List>
                )}

                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                >
                  Don't see your team? Create a new one or accept an invite.
                </Typography>
                <CreateNewTeamButton
                  onClick={() => {
                    navigate("/login/team/register", { replace: true });
                  }}
                />
              </Conditional>

              <Conditional value={isLoading}>
                <List
                  sx={{
                    "& > *": {
                      marginBottom: 1,
                    },
                  }}
                >
                  <Skeleton variant="rectangular" width="100%" height={70} />
                  <Skeleton variant="rectangular" width="100%" height={70} />
                </List>

                <Skeleton variant="rectangular" width="100%" height={24} />

                <Skeleton variant="rectangular" width="100%" height={70} />
              </Conditional>
            </CardContent>
          </Card>

          <Button
            variant="text"
            color="primary"
            fullWidth
            sx={{
              marginTop: 1,
            }}
            onClick={() => {
              authentication.logOut();
            }}
          >
            Log me out
          </Button>
        </Box>
      </Fade>
    </>
  );
};

interface TeamListItemProps {
  name: string;
  role: string;
  avatarUrl?: string;
  onClick?: () => void;
}

const TeamListItem: FunctionComponent<TeamListItemProps> = (props) => {
  return (
    <Paper
      component={ListItemButton}
      elevation={4}
      sx={{
        height: 70,
        marginBottom: 1,
      }}
      onClick={props.onClick}
    >
      <ListItemAvatar>
        {props.avatarUrl && (
          <Avatar
            sx={{
              width: 48,
              height: 48,
            }}
            src={props.avatarUrl}
          />
        )}

        {!props.avatarUrl && (
          <Avatar
            sx={{
              width: 48,
              height: 48,
            }}
          >
            {stringToInitials(props.name)}
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={props.name}
        secondary={props.role}
        primaryTypographyProps={{
          variant: "body2",
        }}
        secondaryTypographyProps={{
          variant: "caption",
        }}
      />
    </Paper>
  );
};

interface CreateNewTeamButtonProps {
  onClick?: () => void;
}

const CreateNewTeamButton: FunctionComponent<CreateNewTeamButtonProps> = (
  props
) => {
  return (
    <Paper
      component={ListItemButton}
      elevation={4}
      sx={{
        height: 70,
        marginBottom: 1,
      }}
      onClick={props.onClick}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            width: 48,
            height: 48,
          }}
        >
          <IoAdd />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary="Create new team"
        primaryTypographyProps={{
          variant: "body2",
          color: "text.secondary",
        }}
      />
    </Paper>
  );
};

export default TeamSelectionView;
