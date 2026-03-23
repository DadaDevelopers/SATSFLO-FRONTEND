import { cn } from "@/lib/utils";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
  /** Called when the "Terms & Conditions" link is tapped */
  onTermsPress?: () => void;
  /** Called when the "Privacy Policy" link is tapped */
  onPrivacyPress?: () => void;
};

export function Checkbox({
  checked,
  onToggle,
  label,
  className,
  onTermsPress,
  onPrivacyPress,
}: CheckboxProps) {
  const hasLinks = onTermsPress || onPrivacyPress;

  return (
    <TouchableOpacity
      className={cn("flex-row items-center gap-1", className)}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {/* Tick box */}
      <View
        className="w-5 h-5 border-[1.5px] border-signup-checkbox-border rounded justify-center items-center"
        style={
          checked
            ? { backgroundColor: "#FAFAFA", borderColor: "#FAFAFA" }
            : undefined
        }
      >
        {checked && (
          <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
            <Path
              d="M9.35375 4.64625C9.40024 4.69269 9.43712 4.74783 9.46228 4.80853C9.48744 4.86923 9.5004 4.93429 9.5004 5C9.5004 5.06571 9.48744 5.13077 9.46228 5.19147C9.43712 5.25217 9.40024 5.30731 9.35375 5.35375L5.85375 8.85375C5.80732 8.90024 5.75217 8.93712 5.69147 8.96228C5.63077 8.98744 5.56571 9.00039 5.5 9.00039C5.4343 9.00039 5.36923 8.98744 5.30853 8.96228C5.24783 8.93712 5.19269 8.90024 5.14625 8.85375L3.64625 7.35375C3.55243 7.25993 3.49972 7.13268 3.49972 7C3.49972 6.86732 3.55243 6.74007 3.64625 6.64625C3.74007 6.55243 3.86732 6.49972 4 6.49972C4.13268 6.49972 4.25993 6.55243 4.35375 6.64625L5.5 7.79313L8.64625 4.64625C8.69269 4.59976 8.74783 4.56288 8.80853 4.53772C8.86923 4.51256 8.93429 4.49961 9 4.49961C9.06571 4.49961 9.13077 4.51256 9.19147 4.53772C9.25217 4.56288 9.30732 4.59976 9.35375 4.64625Z"
              fill="#FF4081"
            />
          </Svg>
        )}
      </View>

      {/* Label – plain or with blue links */}
      {hasLinks ? (
        <Text className="text-xs font-normal leading-[18px] text-signup-body flex-shrink flex-wrap">
          I agree to the{" "}
          <Text
            style={{ color: "#2563EB", fontWeight: "600" }}
            onPress={(e) => {
              e.stopPropagation?.();
              onTermsPress?.();
            }}
          >
            Terms &amp; Conditions
          </Text>
          {" and "}
          <Text
            style={{ color: "#2563EB", fontWeight: "600" }}
            onPress={(e) => {
              e.stopPropagation?.();
              onPrivacyPress?.();
            }}
          >
            Privacy Policy
          </Text>
        </Text>
      ) : (
        <Text className="text-xs font-normal leading-[18px] text-signup-body">
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
