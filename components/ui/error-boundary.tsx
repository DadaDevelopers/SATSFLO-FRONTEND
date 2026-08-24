import logger from "@/lib/logger";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

// Without this, an uncaught render error anywhere below (e.g. bad data
// reaching a native view like react-native-svg's Path, which crashes
// instead of throwing a catchable JS error higher up) unmounts the whole
// tree and leaves the user staring at a blank screen with no way back in
// and nothing logged. This gives them a way to recover and gives us a
// signal that something broke.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error("Unhandled render error", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#FF4081",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
            gap: 16,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Please try again. If this keeps happening, restart the app.
          </Text>
          <TouchableOpacity
            onPress={this.reset}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#FF82AD",
              borderRadius: 999,
              paddingHorizontal: 24,
              paddingVertical: 12,
              marginTop: 8,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
