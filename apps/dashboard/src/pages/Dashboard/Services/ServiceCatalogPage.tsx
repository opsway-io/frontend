import {
  Box,
  Button,
  Card,
  Chip,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd, IoCodeSlashOutline, IoLayersOutline, IoPulseOutline, IoTrashOutline } from "react-icons/io5";
import { PiTerminalWindowBold } from "react-icons/pi";
import Container from "../../../components/Container/Container";
import {
  useDeleteServiceCatalogItem,
  useServiceCatalog,
  useUpsertServiceCatalogItem,
} from "../../../hooks/suite.query";
import { ServiceCatalogItem } from "../../../api/endpoints/suite";

const ServiceCatalogPage: FunctionComponent = () => {
  const { data, isPending } = useServiceCatalog();
  const upsertItem = useUpsertServiceCatalogItem();
  const deleteItem = useDeleteServiceCatalogItem();

  const [modalOpen, setModalOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logService, setLogService] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const services = data?.services || [];

  const handleSave = () => {
    if (!slug || !name) return;
    upsertItem.mutate(
      {
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        name,
        description,
        logSearchServices: logService ? [logService] : [slug],
        repositoryUrl: repoUrl ? repoUrl : undefined,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          setSlug("");
          setName("");
          setDescription("");
          setLogService("");
          setRepoUrl("");
        },
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>Service Catalog | Opsway</title>
      </Helmet>

      <Container
        header="Service Catalog"
        description="Unified registry mapping microservices across Opsway Monitoring, Log-Search, and Code Repositories."
        primaryActions={[
          <Button
            key="add-service"
            size="sm"
            variant="solid"
            color="primary"
            startDecorator={<IoAdd />}
            onClick={() => setModalOpen(true)}
          >
            Add Service
          </Button>,
        ]}
        loading={isPending}
      >
        <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 0, overflow: "hidden" }}>
          <Table hoverRow sx={{ "& th": { bgcolor: "background.level1" } }}>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Service</th>
                <th style={{ width: "25%" }}>Log-Search Name</th>
                <th style={{ width: "25%" }}>Code Repository</th>
                <th style={{ width: "15%" }}>Linked Monitors</th>
                <th style={{ width: "10%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px" }}>
                    <Typography level="body-sm" textColor="text.tertiary">
                      No services registered yet. Click &quot;Add Service&quot; or let Log-Search auto-discover them.
                    </Typography>
                  </td>
                </tr>
              ) : (
                services.map((svc: ServiceCatalogItem) => (
                  <tr key={svc.id}>
                    <td>
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
                          </Typography>
                        </div>
                      </Stack>
                    </td>
                    <td>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <PiTerminalWindowBold size={16} color="#5185a5" />
                        <Chip size="sm" variant="soft" color="neutral">
                          {svc.logSearchServices && svc.logSearchServices.length > 0
                            ? svc.logSearchServices.join(", ")
                            : svc.slug}
                        </Chip>
                      </Stack>
                    </td>
                    <td>
                      {svc.repositoryUrl ? (
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <IoCodeSlashOutline size={16} color="#79ab5d" />
                          <Typography level="body-xs" textColor="text.secondary">
                            {svc.repositoryUrl.replace("https://github.com/", "")}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography level="body-xs" textColor="text.tertiary">
                          —
                        </Typography>
                      )}
                    </td>
                    <td>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <IoPulseOutline size={16} color="#f4ac45" />
                        <Typography level="body-sm">
                          {svc.monitorIds ? `${svc.monitorIds.length} monitors` : "Auto-linked"}
                        </Typography>
                      </Stack>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="danger"
                        onClick={() => deleteItem.mutate(svc.id)}
                      >
                        <IoTrashOutline size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </Container>

      {/* Add Service Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog sx={{ maxWidth: 480, width: "100%" }}>
          <DialogTitle>Add Microservice to Catalog</DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              <FormControl required>
                <FormLabel>Service Display Name</FormLabel>
                <Input
                  placeholder="Checkout Service"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Service Slug</FormLabel>
                <Input
                  placeholder="checkout-service"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Log-Search service.name</FormLabel>
                <Input
                  placeholder="checkout-service (or match container_name)"
                  value={logService}
                  onChange={(e) => setLogService(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Repository URL (GitHub / GitLab)</FormLabel>
                <Input
                  placeholder="https://github.com/opsway-io/backend"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </FormControl>

              <Stack direction="row" spacing={1} justifyContent="flex-end" pt={1}>
                <Button variant="plain" color="neutral" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  loading={upsertItem.isPending}
                  onClick={handleSave}
                >
                  Save Service
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
