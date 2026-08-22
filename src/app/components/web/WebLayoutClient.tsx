"use client";

import React, { useState } from "react";
import Script from "next/script";
import Spinner from "./Spinner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TemplateScript from "./TemplateScript";
import { useWebAuth } from "@/app/context/WebAuthContext";

interface WebLayoutClientProps {
  children: React.ReactNode;
}

export default function WebLayoutClient({ children }: WebLayoutClientProps) {
  const { isLoading } = useWebAuth();
  const [jqueryLoaded, setJqueryLoaded] = useState(false);

  return (
    <div className="web-layout-root">
      {/* 1. Load jQuery First */}
      <Script
        id="jquery"
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js"
        strategy="afterInteractive"
        onLoad={() => setJqueryLoaded(true)}
      />

      {/* 2. Load dependent plugins ONLY after jQuery is ready */}
      {jqueryLoaded && (
        <>
          <Script
            id="bootstrap-js"
            src="/bootstrap.bundle.min.js"
            strategy="afterInteractive"
          />
          <Script
            id="easing"
            src="/assets/lib/easing/easing.min.js"
            strategy="afterInteractive"
          />
          <Script
            id="waypoints"
            src="/assets/lib/waypoints/waypoints.min.js"
            strategy="afterInteractive"
          />
          <Script
            id="lightbox"
            src="/assets/lib/lightbox/js/lightbox.min.js"
            strategy="afterInteractive"
          />
          <Script
            id="owl-carousel"
            src="/assets/lib/owlcarousel/owl.carousel.min.js"
            strategy="afterInteractive"
          />
        </>
      )}

      {/* Page Loader */}
      <Spinner />

      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />

      {/* Back to Top */}
      <a href="#" className="btn btn-primary border-3 border-primary rounded-circle back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>

      {/* Template script initializer */}
      {jqueryLoaded && <TemplateScript />}
    </div>
  );
}
