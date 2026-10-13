import { Box, Container, Typography } from "@mui/joy";
import { FunctionComponent } from "react";

const companies: { name: string; src: string }[] = [
  { name: "Airbnb", src: "https://cdn.worldvectorlogo.com/logos/airbnb-2.svg" },
  {
    name: "Spotify",
    src: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg",
  },
  {
    name: "Coinbase",
    src: "https://cdn.worldvectorlogo.com/logos/coinbase.svg",
  },
  { name: "Lyft", src: "https://cdn.worldvectorlogo.com/logos/lyft.svg" },
  { name: "Plex", src: "https://cdn.worldvectorlogo.com/logos/plex.svg" },
  { name: "Unity", src: "https://cdn.worldvectorlogo.com/logos/unity-69.svg" },
  { name: "Zendesk", src: "https://cdn.worldvectorlogo.com/logos/zendesk.svg" },
];

const SocialProof: FunctionComponent = () => (
  <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 10 } }}>
    <Typography
      level="body-md"
      fontWeight={500}
      textColor="text.tertiary"
      textAlign="center"
      sx={{ mb: { xs: 3, md: 4 } }}
    >
      Teams of all sizes rely on opsway
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: { xs: 4, md: 6 },
        rowGap: 3,
        "& img": {
          height: { xs: 22, md: 28 },
          maxWidth: 120,
          filter: "brightness(0) invert(1)",
          opacity: 0.4,
        },
      }}
    >
      {companies.map((company) => (
        <Box
          key={company.name}
          component="img"
          src={company.src}
          alt={company.name}
        />
      ))}
    </Box>
  </Container>
);

export default SocialProof;
