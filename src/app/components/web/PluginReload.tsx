"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PluginReload() {
    const pathname = usePathname();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/assets/js/main.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
}