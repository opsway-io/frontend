import { Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import { Restrict, Role } from "../../../../components/Restrict";
import { useAlertRule } from "../../../../hooks/alerting.query";
import DeleteAlertRuleDialog from "./components/DeleteAlertRuleDialog";
import EditAlertRuleForm from "./components/EditAlertRuleForm";
import TriggerHistoryCard from "./components/TriggerHistoryCard";

const AlertRuleDetailPage: FunctionComponent = () => {
  const { ruleId } = useParams();
  const id = Number(ruleId);

  const { data: rule, isPending: isLoading, error } = useAlertRule(id);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <Helmet>{rule && <title>{rule.name} | Alerting</title>}</Helmet>

      <Container
        header={rule?.name}
        loading={isLoading}
        error={error && "Failed to load alert rule"}
        breadcrumbs={[
          <Link to="/alerting" key="alerting">
            Alerting
          </Link>,
          <span key="detail">{rule?.name}</span>,
        ]}
        primaryActions={[
          <Restrict min={Role.ADMIN} key="delete">
            <Button
              color="danger"
              variant="outlined"
              disabled={!rule}
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete
            </Button>
          </Restrict>,
        ]}
      >
        {rule ? (
          <Stack spacing={3}>
            {/* Keyed on updatedAt so the form picks up saved values. */}
            <EditAlertRuleForm key={rule.updatedAt} rule={rule} />
            <TriggerHistoryCard ruleId={id} />
          </Stack>
        ) : (
          <Typography level="body-md" textColor="text.secondary">
            Alert rule not found.
          </Typography>
        )}
      </Container>

      <DeleteAlertRuleDialog
        ruleId={id}
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      />
    </>
  );
};

export default AlertRuleDetailPage;
