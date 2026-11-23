import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import { FunctionComponent, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoAdd,
  IoCodeSlashOutline,
  IoCreateOutline,
  IoLayersOutline,
  IoPulseOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { PiTerminalWindowBold } from "react-icons/pi";
import { enqueueSnackbar } from "notistack";
import Container from "../../../components/Container/Container";
import {
  useDeleteServiceCatalogItem,
  useLogSearchServices,
  useServiceCatalog,
  useUpsertServiceCatalogItem,
} from "../../../hooks/suite.query";
import { useMonitors } from "../../../hooks/monitors.query";
import { ServiceCatalogItem } from "../../../api/endpoints/suite";

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatServiceDisplayName(serviceName: string): string {
  return serviceName
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatRepoLabel(url: string): string {
  return url
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^https?:\/\/(www\.)?gitlab\.com\//i, "")
    .replace(/\/+$/, "");
}

interface ServiceFormState {
  id?: number;
  name: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  logSearchServices: string[];
  monitorIds: number[];
  repositoryUrl: string;
}

const EMPTY_FORM: ServiceFormState = {
  name: "",
  slug: "",
  slugTouched: false,
  description: "",
  logSearchServices: [],
  monitorIds: [],
  repositoryUrl: "",
};

const ServiceCatalogPage: FunctionComponent = () => {
  const { data: catalogData, isPending: isCatalogPending } = useServiceCatalog();
  const { data: logSearchData, isPending: isDiscoveryPending } = useLogSearchServices();
  const { data: monitorsResponse } = useMonitors(0, 200);
  const upsertItem = useUpsertServiceCatalogItem();
  const deleteItem = useDeleteServiceCatalogItem();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ServiceFormState>(EMPTY_FORM);

  const services = useMemo(() => catalogData?.services ?? [], [catalogData]);
  const discoveredLogServices = useMemo(() => logSearchData?.services ?? [], [logSearchData]);
  const monitors = useMemo(() => monitorsResponse?.monitors ?? [], [monitorsResponse]);

  const monitorNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const m of monitors) {
      map.set(m.id, m.name);
    }
    return map;
  }, [monitors]);

  const discoveredUnregistered = useMemo(() => {
    const registeredNames = new Set<string>();
    for (const svc of services) {
      registeredNames.add(svc.slug.toLowerCase());
      for (const ls of svc.logSearchServices ?? []) {
        registeredNames.add(ls.toLowerCase());
      }
    }
    return discoveredLogServices.filter((name) => !registeredNames.has(name.toLowerCase()));
  }, [services, discoveredLogServices]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openConfigureDiscoveredModal = (logServiceName: string) => {
    setForm({
      name: formatServiceDisplayName(logServiceName),
      slug: toSlug(logServiceName),
      slugTouched: true,
      description: "",
      logSearchServices: [logServiceName],
      monitorIds: [],
      repositoryUrl: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (svc: ServiceCatalogItem) => {
    setForm({
      id: svc.id,
      name: svc.name,
      slug: svc.slug,
      slugTouched: true,
      description: svc.description ?? "",
      logSearchServices: svc.logSearchServices ?? [],
      monitorIds: svc.monitorIds ?? [],
      repositoryUrl: svc.repositoryUrl ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleQuickRegister = (logServiceName: string) => {
    upsertItem.mutate(
      {
        slug: toSlug(logServiceName),
        name: formatServiceDisplayName(logServiceName),
        logSearchServices: [logServiceName],
        monitorIds: [],
      },
      {
        onSuccess: () => {
          enqueueSnackbar(`Registered "${logServiceName}" in catalog`, { variant: "success" });
        },
        onError: () => {
          enqueueSnackbar(`Failed to register "${logServiceName}"`, { variant: "error" });
        },
      }
    );
  };

  const handleSave = () => {
    const normalizedSlug = toSlug(form.slug);
    const trimmedName = form.name.trim();
    if (!normalizedSlug || !trimmedName) return;

    const cleanedLogServices = Array.from(
      new Set(form.logSearchServices.map((s) => s.trim()).filter(Boolean))
    );

    upsertItem.mutate(
      {
        id: form.id,
        slug: normalizedSlug,
        name: trimmedName,
        description: form.description.trim(),
        logSearchServices: cleanedLogServices,
        monitorIds: form.monitorIds,
        repositoryUrl: form.repositoryUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            form.id ? "Service updated in catalog" : "Service saved to catalog",
            { variant: "success" }
          );
          closeModal();
        },
        onError: () => {
          enqueueSnackbar("Failed to save service", { variant: "error" });
        },
      }
    );
  };

  const isEditing = Boolean(form.id);

  return (
    <>
      <Helmet>
        <title>Service Catalog | Opsway</title>
      </Helmet>

      <Container
        header="Service Catalog"
        description="Auto-discover services from Log-Search and enrich them with linked Opsway Monitors and code repositories."
        primaryActions={[
          <Button
            key="add-service"
            size="sm"
            variant="outlined"
            color="neutral"
            startDecorator={<IoAdd />}
            onClick={openCreateModal}
          >
            Add Service
          </Button>,
        ]}
        loading={isCatalogPending && isDiscoveryPending}
      >
        <Stack spacing={2.5}>
          {discoveredUnregistered.length > 0 && (
            <Card
              variant="soft"
              color="primary"
              sx={{ p: 2, borderRadius: "md" }}
              data-testid="discovered-services-card"
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IoSparklesOutline size={18} />
                    <Typography level="title-sm">
                      Discovered from Log-Search ({discoveredUnregistered.length})
                    </Typography>
                  </Stack>
                  <Typography level="body-xs" textColor="text.secondary">
                    Configure to link monitors and code repositories for automated investigations
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {discoveredUnregistered.map((svcName) => (
                    <Card
                      key={svcName}
                      variant="outlined"
                      size="sm"
                      sx={{
                        bgcolor: "background.surface",
                        px: 1.5,
                        py: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <PiTerminalWindowBold size={15} color="#5185a5" />
                        <Typography level="title-sm">{svcName}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        <Button
                          size="sm"
                          variant="solid"
                          color="primary"
                          onClick={() => openConfigureDiscoveredModal(svcName)}
                        >
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          variant="plain"
                          color="neutral"
                          loading={upsertItem.isPending}
                          onClick={() => handleQuickRegister(svcName)}
                        >
                          Quick Add
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          )}

          <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 0, overflow: "hidden" }}>
            <Table hoverRow sx={{ "& th": { bgcolor: "background.level1" } }}>
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Service</th>
                  <th style={{ width: "24%" }}>Log-Search Services</th>
                  <th style={{ width: "20%" }}>Linked Monitors</th>
                  <th style={{ width: "20%" }}>Code Repository</th>
                  <th style={{ width: "10%", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "32px" }}>
                      <Typography level="body-sm" textColor="text.tertiary">
                        {discoveredUnregistered.length > 0
                          ? "No services registered yet. Configure a discovered service above or add a custom service."
                          : "No services registered yet. Services emitting logs to Log-Search will appear here automatically, or click \"Add Service\" to pre-register one."}
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  services.map((svc: ServiceCatalogItem) => {
                    const linkedMonitorIds = svc.monitorIds ?? [];
                    const linkedMonitorNames = linkedMonitorIds
                      .map((id) => monitorNameById.get(id) ?? `Monitor #${id}`);

                    return (
                      <tr key={svc.id}>
                        <td aria-label={svc.name}>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Box
                              sx={{
                                p: 0.75,
                                borderRadius: "sm",
                                bgcolor: "background.level2",
                                color: "text.primary",
                                display: "flex",
                              }}
                            >
                              <IoLayersOutline size={18} />
                            </Box>
                            <div>
                              <Typography level="title-sm">{svc.name}</Typography>
                              <Typography level="body-xs" textColor="text.tertiary">
                                {svc.slug}
                                {svc.description ? ` · ${svc.description}` : ""}
                              </Typography>
                            </div>
                          </Stack>
                        </td>
                        <td aria-label="Log-Search services">
                          {svc.logSearchServices && svc.logSearchServices.length > 0 ? (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap alignItems="center">
                              <PiTerminalWindowBold size={15} color="#5185a5" />
                              {svc.logSearchServices.map((logSvc) => (
                                <Chip key={logSvc} size="sm" variant="soft" color="neutral">
                                  {logSvc}
                                </Chip>
                              ))}
                            </Stack>
                          ) : (
                            <Typography level="body-xs" textColor="text.tertiary">
                              —
                            </Typography>
                          )}
                        </td>
                        <td aria-label="Linked monitors">
                          {linkedMonitorIds.length > 0 ? (
                            <Tooltip title={linkedMonitorNames.join(", ")} variant="outlined">
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <IoPulseOutline size={16} color="#f4ac45" />
                                <Typography level="body-sm">
                                  {linkedMonitorIds.length === 1
                                    ? linkedMonitorNames[0]
                                    : `${linkedMonitorIds.length} monitors`}
                                </Typography>
                              </Stack>
                            </Tooltip>
                          ) : (
                            <Typography level="body-xs" textColor="text.tertiary">
                              None linked
                            </Typography>
                          )}
                        </td>
                        <td aria-label="Repository">
                          {svc.repositoryUrl ? (
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <IoCodeSlashOutline size={16} color="#79ab5d" />
                              <Link
                                href={svc.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                level="body-xs"
                                textColor="text.secondary"
                              >
                                {formatRepoLabel(svc.repositoryUrl)}
                              </Link>
                            </Stack>
                          ) : (
                            <Typography level="body-xs" textColor="text.tertiary">
                              —
                            </Typography>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }} aria-label="Actions">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Edit / Enrich service">
                              <IconButton
                                size="sm"
                                variant="plain"
                                color="neutral"
                                aria-label={`Edit ${svc.name}`}
                                onClick={() => openEditModal(svc)}
                              >
                                <IoCreateOutline size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove from catalog">
                              <IconButton
                                size="sm"
                                variant="plain"
                                color="danger"
                                aria-label={`Delete ${svc.name}`}
                                onClick={() =>
                                  deleteItem.mutate(svc.id, {
                                    onSuccess: () =>
                                      enqueueSnackbar("Service removed from catalog", {
                                        variant: "success",
                                      }),
                                  })
                                }
                              >
                                <IoTrashOutline size={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Card>
        </Stack>
      </Container>

      {/* Add / Edit Service Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <ModalDialog sx={{ maxWidth: 520, width: "100%" }}>
          <ModalClose />
          <DialogTitle>
            {isEditing ? `Edit ${form.name || "Service"}` : "Register Service in Catalog"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              <FormControl required>
                <FormLabel>Service Display Name</FormLabel>
                <Input
                  placeholder="Checkout Service"
                  value={form.name}
                  onChange={(e) => {
                    const nextName = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name: nextName,
                      slug: prev.slugTouched ? prev.slug : toSlug(nextName),
                    }));
                  }}
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Service Slug</FormLabel>
                <Input
                  placeholder="checkout-service"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value,
                      slugTouched: true,
                    }))
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Handles cart checkout and payment orchestration"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Log-Search Services (service.name)</FormLabel>
                <Autocomplete
                  multiple
                  freeSolo
                  options={discoveredLogServices}
                  value={form.logSearchServices}
                  onChange={(_, value) =>
                    setForm((prev) => ({
                      ...prev,
                      logSearchServices: value.map((v) => String(v)),
                    }))
                  }
                  placeholder="Select discovered services or type custom names"
                />
                <FormHelperText>
                  Maps this catalog entry to one or more Log-Search service names for incident correlation.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Linked Monitors</FormLabel>
                <Autocomplete
                  multiple
                  options={monitors}
                  getOptionLabel={(monitor) => monitor.name}
                  value={monitors.filter((m) => form.monitorIds.includes(m.id))}
                  onChange={(_, selected) =>
                    setForm((prev) => ({
                      ...prev,
                      monitorIds: selected.map((m) => m.id),
                    }))
                  }
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  placeholder="Select monitors to link to this service"
                />
                <FormHelperText>
                  Incidents on linked monitors automatically resolve to this service&apos;s logs during investigations.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Repository URL (GitHub / GitLab)</FormLabel>
                <Input
                  placeholder="https://github.com/opsway-io/backend"
                  value={form.repositoryUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, repositoryUrl: e.target.value }))}
                />
              </FormControl>

              <Stack direction="row" spacing={1} justifyContent="flex-end" pt={1}>
                <Button variant="plain" color="neutral" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  disabled={!form.name.trim() || !toSlug(form.slug)}
                  loading={upsertItem.isPending}
                  onClick={handleSave}
                >
                  {isEditing ? "Save Changes" : "Register Service"}
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default ServiceCatalogPage;
