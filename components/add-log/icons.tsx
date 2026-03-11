import React from "react";
import { Text } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";

// Flow droplet icons with different fill levels
export function FlowLight({ size = 32, selected = false }) {
  const color = selected ? "#FF6B9D" : "#FFB3CD";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C12 2 6 10 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 10 12 2 12 2Z"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M12 16C12 16 9 14 9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14C15 14 12 16 12 16Z"
        fill={color}
      />
    </Svg>
  );
}

export function FlowMedium({ size = 32, selected = false }) {
  const color = selected ? "#FF4081" : "#FF6B9D";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C12 2 6 10 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 10 12 2 12 2Z"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M12 20C8.68629 20 6 17.3137 6 14C6 12 8 10 12 14C16 10 18 12 18 14C18 17.3137 15.3137 20 12 20Z"
        fill={color}
        opacity={0.5}
      />
    </Svg>
  );
}

export function FlowHeavy({ size = 32, selected = false }) {
  const color = selected ? "#E91E63" : "#FF4081";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C12 2 6 10 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 10 12 2 12 2Z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
}

export function FlowVeryHeavy({ size = 32, selected = false }) {
  const color = selected ? "#C2185B" : "#E91E63";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C12 2 6 10 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 10 12 2 12 2Z"
        fill={color}
      />
    </Svg>
  );
}

// Mood emojis
export function MoodNormal({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>😐</Text>;
}

export function MoodHappy({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>😊</Text>;
}

export function MoodCalm({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>😌</Text>;
}

export function MoodHyped({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>🤩</Text>;
}

export function MoodInLove({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>😍</Text>;
}

export function MoodPeaceful({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>😇</Text>;
}

export function MoodLonely({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>😢</Text>;
}

export function MoodAngry({ size = 32 }) {
  return <Text style={{ fontSize: size - 8 }}>😠</Text>;
}

// Symptom icons
export function SymptomCramps({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="8"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M8 12 L16 12" stroke={color} strokeWidth={2} />
      <Path d="M12 8 L12 16" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function SymptomFatigue({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Circle cx="9" cy="10" r="1" fill={color} />
      <Circle cx="15" cy="10" r="1" fill={color} />
      <Path
        d="M8 15 Q12 13 16 15"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
    </Svg>
  );
}

export function SymptomBloating({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Ellipse
        cx="12"
        cy="14"
        rx="7"
        ry="6"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M9 6 Q12 4 15 6" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
}

export function SymptomHeadache({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="8"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M8 8 L10 12 L8 16"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        d="M16 8 L14 12 L16 16"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
    </Svg>
  );
}

export function SymptomBellyAches({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="8"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M9 9 L15 15" stroke={color} strokeWidth={2} />
      <Path d="M15 9 L9 15" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function SymptomAcne({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="8"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Circle cx="10" cy="10" r="1.5" fill={color} />
      <Circle cx="14" cy="11" r="1" fill={color} />
      <Circle cx="11" cy="14" r="1.2" fill={color} />
    </Svg>
  );
}

export function SymptomSoreBreasts({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 10 Q6 18 12 18 Q18 18 18 10"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M6 10 Q9 6 12 10 Q15 6 18 10"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

export function SymptomCravings({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 4 L12 8" stroke={color} strokeWidth={2} />
      <Path
        d="M8 20 L16 20 L14 10 L10 10 Z"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Circle cx="12" cy="14" r="2" fill={color} />
    </Svg>
  );
}

// Medicine icons
export function MedicineCondom({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x="9"
        y="4"
        width="6"
        height="16"
        rx="3"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M9 8 L15 8" stroke={color} strokeWidth={1} />
    </Svg>
  );
}

export function MedicinePill({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x="5"
        y="8"
        width="14"
        height="8"
        rx="4"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M12 8 L12 16"
        stroke={color}
        strokeWidth={1}
        strokeDasharray="2 2"
      />
    </Svg>
  );
}

export function MedicinePatch({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  );
}

export function MedicineIUD({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 4 L12 20" stroke={color} strokeWidth={2} />
      <Path d="M8 6 L12 10 L16 6" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
}

export function MedicineImplant({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x="6"
        y="10"
        width="12"
        height="4"
        rx="2"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

export function MedicineVRing({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="7"
        stroke={color}
        strokeWidth={3}
        fill="none"
      />
    </Svg>
  );
}

export function MedicineInjection({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 4 L12 6" stroke={color} strokeWidth={2} />
      <Rect
        x="10"
        y="6"
        width="4"
        height="12"
        rx="1"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M12 18 L12 20" stroke={color} strokeWidth={2} />
      <Path d="M10 10 L14 10" stroke={color} strokeWidth={1} />
    </Svg>
  );
}

export function MedicineSpermicide({ size = 32, color = "#FF6B9D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8 6 Q8 20 12 20 Q16 20 16 6"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M8 6 L16 6" stroke={color} strokeWidth={2} />
      <Circle cx="10" cy="4" r="1" fill={color} />
      <Circle cx="14" cy="4" r="1" fill={color} />
    </Svg>
  );
}

// Water cup icon
export function WaterCup({ size = 32, filled = false, color = "#4FC3F7" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7 6 L8 20 L16 20 L17 6 Z"
        stroke={color}
        strokeWidth={2}
        fill={filled ? color : "none"}
        opacity={filled ? 0.3 : 1}
      />
      {filled && <Path d="M8 12 L8 20 L16 20 L16 12 Z" fill={color} />}
    </Svg>
  );
}
