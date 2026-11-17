"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export default function TemplateScript() {
  useEffect(() => {
    const init = () => {
      const $ = window.jQuery || window.$;

      if (!$) {
        console.warn("[TemplateScript] jQuery is not loaded.");
        return;
      }

      // ── Spinner ─────────────────────────────────────────────────────────
      const spinner = () => {
        setTimeout(() => {
          if ($("#spinner").length > 0) {
            $("#spinner").removeClass("show");
          }
        }, 1);
      };
      spinner();

      // ── Fixed Navbar ─────────────────────────────────────────────────────
      $(window).scroll(function (this: Window) {
        if ($(window).width() < 992) {
          if ($(this).scrollTop() > 55) {
            $(".fixed-top").addClass("shadow");
          } else {
            $(".fixed-top").removeClass("shadow");
          }
        } else {
          if ($(this).scrollTop() > 55) {
            $(".fixed-top").addClass("shadow").css("top", "-55px");
          } else {
            $(".fixed-top").removeClass("shadow").css("top", "0");
          }
        }
      });

      // ── Back to Top ──────────────────────────────────────────────────────
      $(window).scroll(function (this: Window) {
        if ($(this).scrollTop() > 300) {
          $(".back-to-top").fadeIn("slow");
        } else {
          $(".back-to-top").fadeOut("slow");
        }
      });

      $(".back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
        return false;
      });

      // ── Testimonial Carousel ─────────────────────────────────────────────
      $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
          '<i class="bi bi-arrow-left"></i>',
          '<i class="bi bi-arrow-right"></i>',
        ],
        responsive: {
          0: { items: 1 },
          576: { items: 1 },
          768: { items: 1 },
          992: { items: 2 },
          1200: { items: 2 },
        },
      });

      // ── Vegetable Carousel ───────────────────────────────────────────────
      $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
          '<i class="bi bi-arrow-left"></i>',
          '<i class="bi bi-arrow-right"></i>',
        ],
        responsive: {
          0: { items: 1 },
          576: { items: 1 },
          768: { items: 2 },
          992: { items: 3 },
          1200: { items: 4 },
        },
      });

      // ── Modal Video ──────────────────────────────────────────────────────
      let videoSrc = "";

      $(".btn-play").click(function (this: HTMLElement) {
        videoSrc = $(this).data("src");
      });

      $("#videoModal").on("shown.bs.modal", function () {
        $("#video").attr(
          "src",
          videoSrc + "?autoplay=1&modestbranding=1&showinfo=0"
        );
      });

      $("#videoModal").on("hide.bs.modal", function () {
        $("#video").attr("src", videoSrc);
      });

      // ── Product Quantity ─────────────────────────────────────────────────
      $(".quantity button").on("click", function (this: HTMLElement) {
        const button = $(this);
        const input = button.closest(".quantity").find("input");
        let value = Number(input.val());
        value = button.hasClass("btn-plus")
          ? value + 1
          : Math.max(0, value - 1);
        input.val(value);
      });
    };

    // Poll until jQuery + owlCarousel are both ready (loaded via <Script> tags)
    const timer = setInterval(() => {
      if (window.jQuery && (window.jQuery.fn as any).owlCarousel) {
        clearInterval(timer);
        init();
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return null;
}
