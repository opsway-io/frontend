import { Card, Sheet, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { IMaintenanceWindow } from "../../../../api/endpoints/maintenance";
import Placeholder from "../../../../components/Placeholder/Placeholder";

interface MaintenanceListProps {
  loading: boolean;
  windows: IMaintenanceWindow[];
  emptyText: string;
  subtitle: (maintenanceWindow: IMaintenanceWindow) => string;
}

const MaintenanceList: FunctionComponent<MaintenanceListProps> = ({
  loading,
  windows,
  emptyText,
  subtitle,
}) => {
  if (loading) {
    return (
      <Card>
        <Placeholder />
      </Card>
    );
  }

  if (windows.length === 0) {
    return (
      <Sheet
        variant="outlined"
        sx={{ borderRadius: "lg", p: 4, borderStyle: "dashed" }}
      >
        <Typography
          level="body-sm"
          textColor="text.secondary"
          textAlign="center"
        >
          {emptyText}
        </Typography>
      </Sheet>
    );
  }

  return (
    <Stack spacing={1.5}>
      {windows.map((maintenanceWindow) => (
        <Card
          key={maintenanceWindow.id}
          component={Link}
          to={`${maintenanceWindow.id}`}
          sx={{
            textDecoration: "none",
            gap: 0.5,
            transition: "background-color 120ms, border-color 120ms",
            "&:hover": {
              bgcolor: "background.level1",
              borderColor: "neutral.outlinedBorder",
            },
          }}
        >
          <Typography level="title-md" textColor="text.primary">
            {maintenanceWindow.title || "Untitled Window"}
          </Typography>
          <Typography level="body-sm" textColor="text.secondary">
            {subtitle(maintenanceWindow)}
          </Typography>
        </Card>
      ))}
    </Stack>
  );
};

export default MaintenanceList;
