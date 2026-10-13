import { Box, Link, Table, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { BiWorld } from "react-icons/bi";
import { BsFillShieldLockFill } from "react-icons/bs";
import CodeSnippet from "../../../../components/CodeSnippet/CodeSnippet";
import InstructionCard from "./InstructionCard";

const CNAME_TARGET = "status.opsway.eu";

interface CustomDomainInstructionsProps {
  domain?: string;
}

/** DNS + SSL instructions shown beneath the custom domain field. */
const CustomDomainInstructions: FunctionComponent<
  CustomDomainInstructionsProps
> = ({ domain }) => {
  return (
    <>
      <InstructionCard icon={<BiWorld />} title="DNS records">
        <Typography level="body-sm" textColor="text.secondary">
          You need to add a CNAME record to your DNS provider which points to:
        </Typography>

        <CodeSnippet
          code={CNAME_TARGET}
          copyMessage="Copied DNS CNAME value to clipboard"
        />

        <Typography level="body-sm" textColor="text.secondary">
          Example if you are using Cloudflare, you can use the following DNS
          record:
        </Typography>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "md",
            overflow: "auto",
            bgcolor: "background.surface",
          }}
        >
          <Table
            size="sm"
            sx={{
              "& tbody tr:last-child td": { borderBottom: 0 },
              "& td": { fontFamily: "code" },
            }}
          >
            <thead>
              <tr>
                <th>Host</th>
                <th>Type</th>
                <th>Value</th>
                <th>TTL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{domain ? domain.split(".")[0] : "status"}</td>
                <td>CNAME</td>
                <td>{CNAME_TARGET}</td>
                <td>Automatic</td>
              </tr>
            </tbody>
          </Table>
        </Box>
      </InstructionCard>

      <InstructionCard icon={<BsFillShieldLockFill />} title="SSL certificate">
        <Typography level="body-sm" textColor="text.secondary">
          The first time you visit your status page, we will automatically issue
          a SSL certificate for it. This may take a few minutes. The SSL
          certificate is provided by{" "}
          <Link
            href="https://letsencrypt.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Let's Encrypt
          </Link>{" "}
          and is automatically renewed.
        </Typography>
      </InstructionCard>
    </>
  );
};

export default CustomDomainInstructions;
