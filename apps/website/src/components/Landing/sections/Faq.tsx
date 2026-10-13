import Reveal from "../Reveal";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Container,
  Typography,
  accordionSummaryClasses,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { SectionHeading, sectionSx } from "../primitives";

const faqs: { question: string; answer: string }[] = [
  {
    question: "Is opsway free?",
    answer:
      "Yes. The Free plan covers up to 10 users, 5 monitors and 5 status pages. Paid plans add more monitors, on-call schedules and longer history.",
  },
  {
    question: "Is opsway really open source?",
    answer:
      "Yes, the source code is on GitHub. You can read it, contribute to it, or run it yourself.",
  },
  {
    question: "How often can I check my services?",
    answer:
      "Anywhere from every 30 seconds to once a day, set individually for each monitor.",
  },
  {
    question: "What can a check verify?",
    answer:
      "Status codes, headers, JSON body values and response times — across one or several chained requests — plus TLS certificate validity and expiry.",
  },
  {
    question: "Where do alerts go?",
    answer:
      "Email, Slack, Microsoft Teams, Discord, Telegram, Datadog, New Relic and any webhook endpoint.",
  },
];

const Faq: FunctionComponent = () => (
  <Box
    id="faq"
    sx={{ borderTop: "1px solid", borderColor: "divider", scrollMarginTop: 72 }}
  >
    <Container maxWidth="md" sx={sectionSx}>
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about opsway."
      />
      <AccordionGroup
        variant="plain"
        transition="0.2s ease"
        sx={{
          maxWidth: 768,
          mx: "auto",
          [`& .${accordionSummaryClasses.button}`]: {
            py: 2.5,
            fontWeight: 600,
            fontSize: "lg",
            color: "text.primary",
          },
          [`& .${accordionSummaryClasses.button}:hover`]: {
            bgcolor: "transparent",
          },
        }}
      >
        {faqs.map((faq, i) => (
          <Accordion key={faq.question} defaultExpanded={i === 0}>
            <AccordionSummary>{faq.question}</AccordionSummary>
            <AccordionDetails>
              <Typography
                level="body-md"
                textColor="text.secondary"
                sx={{ pb: 2.5 }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </AccordionGroup>
    </Container>
  </Box>
);

const RevealedFaq: FunctionComponent = () => (
  <Reveal>
    <Faq />
  </Reveal>
);

export default RevealedFaq;
