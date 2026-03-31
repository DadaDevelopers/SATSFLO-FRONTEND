import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "terms" | "privacy";

type Props = {
  visible: boolean;
  onAgree: () => void;
  onDismiss: () => void;
  /** Which tab to open first */
  initialTab?: Tab;
};

// ─── Content ──────────────────────────────────────────────────────────────────
const TERMS_SECTIONS = [
  {
    heading: "1.  YOUR HEALTH DATA",
    body: "We collect cycle dates, symptoms, moods, and notes you log. This data is encrypted on your device and stored securely. We never sell, rent, or share your personal health information with advertisers or third parties without your explicit consent.",
  },
  {
    heading: "2.  How We Use Your Data",
    body: "Your data is used exclusively to power your personal cycle predictions, health insights, and in-app features. Aggregated, de-identified data may be used to improve our prediction models; you can opt out of this at any time in Settings.",
  },
  {
    heading: "3.  YOUR RIGHTS",
    body: "You may request a full export of your data, correct any inaccuracies, or permanently delete your account and all associated data at any time from Settings → Account → Delete account. Deletion is irreversible and completed within 30 days.",
  },
  {
    heading: "4.  AGE REQUIREMENT",
    body: "You must be at least 13 years of age to use this app. If you are under 18, please review these terms with a trusted adult before continuing.",
  },
  {
    heading: "5.  HEALTH DISCLAIMER",
    body: "Our insights are for informational purposes only and do not constitute medical advice. Always consult a qualified healthcare professional for medical decisions.",
  },
  {
    heading: "6.  NOTIFICATIONS",
    body: "By creating an account, you agree to receive cycle predictions and optional health reminders via push notifications. You can manage or disable notifications at any time in your device settings.",
  },
  {
    heading: "7.  CHANGES TO THESE TERMS",
    body: "We may update these terms from time to time. We'll notify you of significant changes via the app or email. Continued use after changes means you accept the updated terms.",
  },
];

const PRIVACY_SECTIONS = [
  {
    heading: "1.  WHAT WE COLLECT",
    body: "We collect your name, email address, and the health data you log including cycle dates, symptoms, moods, and notes. We also collect anonymised usage data to improve the app experience.",
  },
  {
    heading: "2.  HOW WE STORE IT",
    body: "All personal health data is encrypted at rest and in transit using AES-256 encryption. Your data is stored on secure, globally distributed servers with strict access controls.",
  },
  {
    heading: "3.  WHO CAN SEE IT",
    body: "Only you can access your personal health data. Our team may work with anonymised, aggregated data to improve predictions. We never share identifiable data with third parties without your explicit consent.",
  },
  {
    heading: "4.  INTERNATIONAL TRANSFERS",
    body: "As a global product, your data may be processed in countries outside Kenya. Where this occurs, we ensure equivalent data protection safeguards are in place in accordance with the Kenya DPA 2019.",
  },
  {
    heading: "5.  COOKIES & ANALYTICS",
    body: "We use minimal analytics to understand app usage in aggregate. We do not use advertising trackers or sell data to ad networks of any kind.",
  },
  {
    heading: "6.  YOUR RIGHTS",
    body: "Under the Kenya Data Protection Act 2019 and applicable global laws, you have the right to access, correct, port, or delete your data. To exercise these rights, contact us at hello@satsflo.com, we respond within 48 hours.",
  },
  {
    heading: "7.  POLICY UPDATES",
    body: "We may update this policy occasionally. We'll notify you of material changes via the app or email. Your continued use of Satsflo after changes constitutes acceptance of the revised policy.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function TermsModal({
  visible,
  onAgree,
  onDismiss,
  initialTab = "terms",
}: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const translateY = useRef(new Animated.Value(600)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  React.useEffect(() => {
    if (visible) setActiveTab(initialTab);
  }, [visible, initialTab]);

  const sections = activeTab === "terms" ? TERMS_SECTIONS : PRIVACY_SECTIONS;
  const title = activeTab === "terms" ? "Terms & Conditions" : "Privacy Policy";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onDismiss}
      />

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.starIcon}>★</Text>
        </View>
        <Text style={styles.dateText}>Last updated: 20th March, 2026</Text>

        {/* Pink divider */}
        <View style={styles.divider} />

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "terms" && styles.tabActive]}
            onPress={() => setActiveTab("terms")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "terms" && styles.tabLabelActive,
              ]}
            >
              Terms & Conditions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "privacy" && styles.tabActive]}
            onPress={() => setActiveTab("privacy")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "privacy" && styles.tabLabelActive,
              ]}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((s, i) => (
            <View key={i} style={styles.section}>
              <Text style={styles.sectionHeading}>{s.heading}</Text>
              <Text style={styles.sectionBody}>{s.body}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.agreeBtn}
            onPress={onAgree}
            activeOpacity={0.85}
          >
            <Text style={styles.agreeBtnText}>I Agree to Both</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDismiss}
            activeOpacity={0.7}
            style={styles.dismissBtn}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PINK = "#FF4081";
const PINK_SHEET = "#FFE5EE";
const SECTION_HEADING = "#FF4081";

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: PINK_SHEET,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF4081",
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  starIcon: {
    fontSize: 16,
    color: "#bbd3f6",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  dateText: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  divider: {
    height: 1.5,
    backgroundColor: "#FF4081",
    borderRadius: 2,
    marginBottom: 14,
    opacity: 0.35,
  },
  // Tabs
  tabRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tabActive: {
    backgroundColor: PINK_SHEET,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#C0809A",
  },
  tabLabelActive: {
    color: "#1A1A1A",
    fontWeight: "700",
  },
  // Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
    gap: 14,
  },
  section: {
    gap: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: SECTION_HEADING,
    letterSpacing: 0.4,
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 20,
    color: "#444",
  },
  // Actions
  actions: {
    marginTop: 16,
    alignItems: "center",
    gap: 10,
  },
  agreeBtn: {
    width: "100%",
    backgroundColor: PINK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  agreeBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  dismissBtn: {
    paddingVertical: 6,
  },
  dismissText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
});
