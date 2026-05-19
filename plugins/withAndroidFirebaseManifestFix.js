const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Fixes AndroidManifest merger conflict between expo-notifications and
 * @react-native-firebase/messaging. Both set the same meta-data tags.
 * This plugin adds tools:replace so Gradle uses expo-notifications' values.
 */
module.exports = function withAndroidFirebaseManifestFix(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // Ensure tools namespace is declared on the root manifest element
    if (manifest.manifest.$) {
      manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    const application = manifest.manifest.application?.[0];
    if (!application) return config;

    const metaData = application["meta-data"] ?? [];

    // Fix: default_notification_channel_id conflict
    const channelMeta = metaData.find(
      (m) =>
        m.$?.["android:name"] ===
        "com.google.firebase.messaging.default_notification_channel_id"
    );
    if (channelMeta) {
      channelMeta.$["tools:replace"] = "android:value";
    }

    // Fix: default_notification_color conflict
    const colorMeta = metaData.find(
      (m) =>
        m.$?.["android:name"] ===
        "com.google.firebase.messaging.default_notification_color"
    );
    if (colorMeta) {
      colorMeta.$["tools:replace"] = "android:resource";
    }

    return config;
  });
};
