import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoAddOutline,
  IoCloseOutline,
  IoFlagOutline,
  IoPersonAddOutline,
  IoShieldCheckmarkOutline,
  IoTrashOutline,
} from "react-icons/io5";
import {
  ProductFlag,
  ProductSlug,
  ProductVisibility,
} from "../../../api/endpoints/platform";
import Container from "../../../components/Container/Container";
import Placeholder from "../../../components/Placeholder/Placeholder";
import {
  useAddPlatformOwner,
  useAdminProductFlags,
  usePlatformOwners,
  useRemovePlatformOwner,
  useUpdateAdminProductFlag,
} from "../../../hooks/platform.query";
import { useCurrentUser } from "../../../hooks/user.query";

const PRODUCT_LABELS: Record<ProductSlug, string> = {
  monitoring: "Monitoring",
  log_search: "Log Search",
  managed_agent: "Autonomous Agents",
  pantomath: "Pantomath",
};

const VISIBILITY_META: Record<
  ProductVisibility,
  { label: string; color: "danger" | "warning" | "primary" | "success"; hint: string }
> = {
  disabled: {
    label: "Disabled (Off for everyone)",
    color: "danger",
    hint: "Hidden and blocked for all users, including platform owners.",
  },
  owner_only: {
    label: "Platform Owners Only",
    color: "warning",
    hint: "Visible and accessible only to users marked as Platform Owner (development / preview).",
  },
  targeted: {
    label: "Specific Users & Owners",
    color: "primary",
    hint: "Visible to platform owners plus the allowlisted users below.",
  },
  enabled: {
    label: "All Users",
    color: "success",
    hint: "Visible and available to all authenticated users.",
  },
};

const ProductFlagCard: FunctionComponent<{ flag: ProductFlag }> = ({ flag }) => {
  const updateFlag = useUpdateAdminProductFlag();
  const [emailInput, setEmailInput] = useState("");

  const meta = VISIBILITY_META[flag.visibility] ?? VISIBILITY_META.enabled;

  const handleVisibilityChange = (newVisibility: ProductVisibility | null) => {
    if (!newVisibility || newVisibility === flag.visibility) return;
    updateFlag.mutate(
      {
        product: flag.product,
        visibility: newVisibility,
        allowedUserIds: flag.allowedUserIds,
        allowedTeamIds: flag.allowedTeamIds,
      },
      {
        onSuccess: () =>
          enqueueSnackbar(
            `Updated ${PRODUCT_LABELS[flag.product]} visibility to ${VISIBILITY_META[newVisibility].label}`,
            { variant: "success" },
          ),
        onError: () =>
          enqueueSnackbar("Failed to update product visibility", {
            variant: "error",
          }),
      },
    );
  };

  const handleAddAllowlistEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    updateFlag.mutate(
      {
        product: flag.product,
        visibility: flag.visibility,
        allowedUserIds: flag.allowedUserIds,
        allowedEmails: [trimmed],
        allowedTeamIds: flag.allowedTeamIds,
      },
      {
        onSuccess: () => {
          setEmailInput("");
          enqueueSnackbar(`Added ${trimmed} to ${PRODUCT_LABELS[flag.product]} allowlist`, {
            variant: "success",
          });
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to add user to allowlist";
          enqueueSnackbar(msg, { variant: "error" });
        },
      },
    );
  };

  const handleRemoveAllowedUser = (userId: number) => {
    updateFlag.mutate(
      {
        product: flag.product,
        visibility: flag.visibility,
        allowedUserIds: flag.allowedUserIds.filter((id) => id !== userId),
        allowedTeamIds: flag.allowedTeamIds,
      },
      {
        onSuccess: () =>
          enqueueSnackbar("Removed user from allowlist", { variant: "success" }),
        onError: () =>
          enqueueSnackbar("Failed to remove user from allowlist", {
            variant: "error",
          }),
        },
    );
  };

  return (
    <Card variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography level="title-md" fontWeight={700}>
                {PRODUCT_LABELS[flag.product] || flag.product}
              </Typography>
              <Chip size="sm" variant="soft" color={meta.color}>
                {meta.label}
              </Chip>
            </Stack>
            <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.5 }}>
              {flag.description || meta.hint}
            </Typography>
          </Box>

          <Select
            value={flag.visibility}
            disabled={updateFlag.isPending}
            onChange={(_, val) => handleVisibilityChange(val)}
            sx={{ minWidth: 240 }}
          >
            <Option value="disabled">Disabled (Off for everyone)</Option>
            <Option value="owner_only">Platform Owners Only</Option>
            <Option value="targeted">Specific Users &amp; Owners</Option>
            <Option value="enabled">All Users</Option>
          </Select>
        </Stack>

        {flag.visibility === "targeted" && (
          <>
            <Divider />
            <Stack spacing={1.25}>
              <Typography level="body-xs" fontWeight={600} textTransform="uppercase">
                Allowlisted Users
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {flag.allowedUsers.length === 0 ? (
                  <Typography level="body-xs" textColor="text.tertiary">
                    No specific users allowlisted yet (only platform owners have access).
                  </Typography>
                ) : (
                  flag.allowedUsers.map((u) => (
                    <Chip
                      key={u.id}
                      variant="soft"
                      color="primary"
                      endDecorator={
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleRemoveAllowedUser(u.id)}
                          aria-label={`Remove ${u.email}`}
                        >
                          <IoCloseOutline />
                        </IconButton>
                      }
                    >
                      {u.email}
                    </Chip>
                  ))
                )}
              </Stack>

              <Stack direction="row" spacing={1} sx={{ maxWidth: 420 }}>
                <Input
                  size="sm"
                  placeholder="Add user by email (e.g. dev@opsway.eu)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAllowlistEmail();
                    }
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  size="sm"
                  variant="soft"
                  startDecorator={<IoAddOutline />}
                  loading={updateFlag.isPending}
                  onClick={handleAddAllowlistEmail}
                >
                  Add
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
};

export const PlatformProductsPage: FunctionComponent = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: flagsData, isPending: isLoadingFlags } = useAdminProductFlags();
  const { data: ownersData, isPending: isLoadingOwners } = usePlatformOwners();
  const addOwner = useAddPlatformOwner();
  const removeOwner = useRemovePlatformOwner();
  const [newOwnerEmail, setNewOwnerEmail] = useState("");

  if (isLoadingFlags || isLoadingOwners) {
    return (
      <Container>
        <Placeholder />
      </Container>
    );
  }

  const flags = flagsData?.flags || [];
  const owners = ownersData?.owners || [];

  const handleAddOwner = () => {
    const trimmed = newOwnerEmail.trim();
    if (!trimmed) return;
    addOwner.mutate(trimmed, {
      onSuccess: () => {
        setNewOwnerEmail("");
        enqueueSnackbar(`Granted platform owner access to ${trimmed}`, {
          variant: "success",
        });
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || "Failed to add platform owner";
        enqueueSnackbar(msg, { variant: "error" });
      },
    });
  };

  const handleRemoveOwner = (userId: number, email: string) => {
    removeOwner.mutate(userId, {
      onSuccess: () =>
        enqueueSnackbar(`Revoked platform owner access from ${email}`, {
          variant: "success",
        }),
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || "Failed to remove platform owner";
        enqueueSnackbar(msg, { variant: "error" });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Platform Products &amp; Owners | Opsway</title>
      </Helmet>
      <Container>
        <Stack spacing={4} sx={{ py: 3 }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <IoFlagOutline size={22} />
              <Typography level="h2" fontSize="xl" fontWeight={700}>
                Platform Product Rollout
              </Typography>
            </Stack>
            <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.5 }}>
              Toggle Opsway products on or off globally, restrict them to platform owners while
              in development, or roll them out to specific users.
            </Typography>
          </Box>

          <Stack spacing={2}>
            {flags.map((flag) => (
              <ProductFlagCard key={flag.product} flag={flag} />
            ))}
          </Stack>

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1 }}>
              <IoShieldCheckmarkOutline size={20} />
              <Typography level="h3" fontSize="lg" fontWeight={700}>
                Platform Owners
              </Typography>
            </Stack>
            <Typography level="body-sm" textColor="text.secondary" sx={{ mb: 2 }}>
              Platform owners can access products set to &ldquo;Platform Owners Only&rdquo; and
              manage global product visibility.
            </Typography>

            <Card variant="outlined" sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} sx={{ maxWidth: 460 }}>
                  <Input
                    size="sm"
                    placeholder="Grant owner access by user email"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddOwner();
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    size="sm"
                    startDecorator={<IoPersonAddOutline />}
                    loading={addOwner.isPending}
                    onClick={handleAddOwner}
                  >
                    Add Owner
                  </Button>
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  {owners.map((owner) => (
                    <Stack
                      key={owner.id}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: "sm",
                        bgcolor: "background.level1",
                      }}
                    >
                      <Box>
                        <Typography level="title-sm">
                          {owner.displayName || owner.name}
                          {owner.id === currentUser?.id ? " (You)" : ""}
                        </Typography>
                        <Typography level="body-xs" textColor="text.secondary">
                          {owner.email}
                        </Typography>
                      </Box>
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="danger"
                        disabled={owners.length <= 1 || removeOwner.isPending}
                        onClick={() => handleRemoveOwner(owner.id, owner.email)}
                        title={
                          owners.length <= 1
                            ? "At least one platform owner is required"
                            : "Remove platform owner"
                        }
                      >
                        <IoTrashOutline />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default PlatformProductsPage;
