import { createLazyFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import ApiSection from "../components/Landing/sections/ApiSection";
import Cta from "../components/Landing/sections/Cta";
import Faq from "../components/Landing/sections/Faq";
import FeatureBento from "../components/Landing/sections/FeatureBento";
import FeatureHighlights from "../components/Landing/sections/FeatureHighlights";
import Hero from "../components/Landing/sections/Hero";
import HowItWorks from "../components/Landing/sections/HowItWorks";
import Integrations from "../components/Landing/sections/Integrations";
import OpenSource from "../components/Landing/sections/OpenSource";
import SocialProof from "../components/Landing/sections/SocialProof";
import Stats from "../components/Landing/sections/Stats";

export const Route = createLazyFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <Helmet>
        <title>
          Opsway: Unified Observability & Autonomous SRE Suite (Monitoring + Log Search + AI Agents) 🚀
        </title>
        <meta
          name="description"
          content="Opsway connects real-time uptime monitoring, lightning-fast semantic log search, and autonomous AI agents for instant incident investigation and automated remediation."
        />
      </Helmet>

      <Hero />
      <Stats />
      <SocialProof />
      <FeatureHighlights />
      <FeatureBento />
      <Integrations />
      <ApiSection />
      <HowItWorks />
      <OpenSource />
      <Faq />
      <Cta />
    </>
  );
}
