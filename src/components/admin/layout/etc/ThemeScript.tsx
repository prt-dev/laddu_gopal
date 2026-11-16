"use client";

import Script from "next/script";
import React, { useState } from "react";

export default function ThemeScript() {
  const [chartLoaded, setChartLoaded] = useState(false);

  return (
    <>
      {/* Alpine.js Library */}
      <Script
        id="alpine-js"
        src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
        strategy="lazyOnload"
      />

      {/* Theme Init Alpine Script */}
      <Script
        id="init-alpine"
        src="/admin/assets/js/init-alpine.js"
        strategy="lazyOnload"
      />

      {/* 1. Chart.js Library */}
      <Script
        id="chart-js"
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"
        strategy="afterInteractive"
        onLoad={() => setChartLoaded(true)}
      />

      {/* 2. Theme Charts Scripts (loaded only after Chart.js is ready) */}
      {chartLoaded && (
        <>
          <Script
            id="charts-lines"
            src="/admin/assets/js/charts-lines.js"
            strategy="afterInteractive"
          />
          <Script
            id="charts-pie"
            src="/admin/assets/js/charts-pie.js"
            strategy="afterInteractive"
          />
          <Script
            id="charts-bars"
            src="/admin/assets/js/charts-bars.js"
            strategy="afterInteractive"
          />
        </>
      )}

      {/* Focus Trap Utility */}
      <Script
        id="focus-trap"
        src="/admin/assets/js/focus-trap.js"
        strategy="lazyOnload"
      />
    </>
  );
}
