import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

export default function InviteRedirect() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  return <Redirect href={`/(tabs)/enter-code?code=${code ?? ""}` as any} />;
}
