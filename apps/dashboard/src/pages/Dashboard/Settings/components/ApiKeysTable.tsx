import { IconButton, Sheet, Table, Tooltip, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, ReactNode } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useApiKeys, useDeleteApiKey } from "../../../../hooks/apikeys.query";

const MessageRow: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <tr>
    <td colSpan={3}>
      <Typography
        level="body-sm"
        textColor="text.tertiary"
        textAlign="center"
        sx={{ py: 2 }}
      >
        {children}
      </Typography>
    </td>
  </tr>
);

const ApiKeysTable: FunctionComponent = () => {
  const { data, isPending: isLoading } = useApiKeys();
  const { mutate: deleteApiKey } = useDeleteApiKey();
  const apiKeys = data?.apiKeys ?? [];

  const revoke = (keyId: number) =>
    deleteApiKey(keyId, {
      onSuccess: () => {
        enqueueSnackbar("API key revoked", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Failed to revoke API key", { variant: "error" });
      },
    });

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
      <Table
        sx={{
          "--TableCell-paddingX": "12px",
          "& tbody tr:last-of-type td": { borderBottom: "none" },
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th style={{ width: 80, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <MessageRow>Loading…</MessageRow>}
          {!isLoading && apiKeys.length === 0 && (
            <MessageRow>No API keys generated yet.</MessageRow>
          )}
          {apiKeys.map((key) => (
            <tr key={key.id}>
              <td>
                <Typography level="title-sm">{key.name}</Typography>
              </td>
              <td>
                <Typography level="body-sm" textColor="text.secondary">
                  {new Date(key.createdAt).toLocaleDateString()}
                </Typography>
              </td>
              <td style={{ textAlign: "right" }}>
                <Tooltip title="Revoke key">
                  <IconButton
                    variant="plain"
                    color="danger"
                    aria-label={`Revoke key ${key.name}`}
                    onClick={() => revoke(key.id)}
                  >
                    <IoTrashOutline />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default ApiKeysTable;
