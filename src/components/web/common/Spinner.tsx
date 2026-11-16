"use client";

import React from "react";
import Loading, { LoadingProps } from "@/components/common/Loading";

export default function Spinner(props: LoadingProps) {
  return <Loading variant="container" size="md" {...props} />;
}
