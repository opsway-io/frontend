"use client";

import React from "react";
import { OpswayTopBar } from "@opsway/shell";
import { BillingPanel } from "../../components/BillingPanel";

export default function LogSearchBillingPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#13161b] text-[#e7e9ee]">
      <OpswayTopBar currentApp="logs" brandHref="/" />
      <main className="flex-1 min-h-0 overflow-auto">
        <div className="w-full max-w-[1100px] mx-auto px-4 py-6 md:px-8">
          <div className="mb-4">
            <a
              href="/"
              className="text-xs text-[#93c5fd] hover:underline no-underline"
            >
              ← Back to Log Search
            </a>
          </div>
          <BillingPanel />
        </div>
      </main>
    </div>
  );
}
