import { useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// fillHeight controls how tall the SVG is — it always fills from the wave curve
// down to the bottom of the SVG with #FFDBE7, so it can cover the image bottom.
export default function TopWave({ fillHeight = 56 }: { fillHeight?: number }) {
  const { width } = useWindowDimensions();
  return (
    <Svg
      width={width}
      height={fillHeight}
      viewBox={`0 0 393 ${fillHeight}`}
      fill="none"
      preserveAspectRatio="none"
    >
      <Path
        d={`M393 ${fillHeight}L0 ${fillHeight}L0 39.0694C0 39.0694 59.8477 -29.6743 205.477 15.2115C351.107 60.0973 393 15.2115 393 15.2115L393 ${fillHeight}Z`}
        fill="#FFDBE7"
      />
    </Svg>
  );
}
