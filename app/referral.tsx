import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

/** Opens the normal sign-up flow while preserving the referrer's code. */
export default function ReferralRedirect() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  return <Redirect href={`/(auth)/signup?ref=${encodeURIComponent(code ?? "")}` as any} />;
}
