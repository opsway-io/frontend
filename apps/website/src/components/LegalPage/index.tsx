import { Box, Container } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface LegalPageProps {
  children: ReactNode;
}

/**
 * Readable long-form typography for legal pages (privacy, terms, GDPR).
 * Styles plain HTML children (h1/h2/h3/p/ul/li/a/strong) via theme tokens.
 */
const LegalPage: FunctionComponent<LegalPageProps> = ({ children }) => {
  return (
    <Container maxWidth="md" sx={{ pt: { xs: 8, md: 12 } }}>
      <Box
        component="article"
        sx={{
          maxWidth: 760,
          mx: "auto",
          color: "text.secondary",
          fontSize: { xs: "15px", md: "16px" },
          lineHeight: 1.75,
          overflowWrap: "anywhere",

          "& h1": {
            color: "text.primary",
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            m: 0,
          },
          "& h1 + p": {
            mt: 1,
            mb: 4,
            pb: 4,
            fontSize: "sm",
            color: "text.tertiary",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
          "& h2": {
            color: "text.primary",
            fontSize: { xs: "1.375rem", md: "1.5rem" },
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            mt: 6,
            mb: 1.5,
            scrollMarginTop: "80px",
          },
          "& h3": {
            color: "text.primary",
            fontSize: "1.125rem",
            fontWeight: 600,
            lineHeight: 1.4,
            mt: 4,
            mb: 1,
          },
          "& p": { my: 2 },
          "& ul": { pl: 3, my: 2 },
          "& li": { my: 1, "&::marker": { color: "text.tertiary" } },
          "& li > p": { my: 0 },
          "& strong": { color: "text.primary", fontWeight: 600 },
          "& a": {
            color: "primary.300",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationColor: "var(--joy-palette-primary-700)",
            "&:hover": { textDecorationColor: "currentColor" },
          },
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default LegalPage;
