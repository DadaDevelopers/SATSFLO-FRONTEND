import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  ClipPath,
  Defs,
  G,
  Mask,
  Path,
  Rect,
  Image as SvgImage,
} from "react-native-svg";

/**
 * Exact Figma SVG (162×150) — two decorative wing shapes clipped by rotated rects,
 * plus two circular profile photos with #FFB3CD stroke.
 * Base64 image data replaced with local asset requires.
 */
function PartnerProfiles() {
  return (
    <Svg width="162" height="150" viewBox="0 0 162 150" fill="none">
      <Defs>
        {/* clip0 — rotated 40×40 mask for decorative leaf top-right */}
        <ClipPath id="pw_clip0">
          <Rect
            width="40"
            height="40"
            fill="white"
            transform="translate(111.922 55.1191) rotate(-148)"
          />
        </ClipPath>

        {/* clip1 — rotated 40×40 mask for decorative leaf bottom-left */}
        <ClipPath id="pw_clip1">
          <Rect
            width="40"
            height="40"
            fill="white"
            transform="translate(49.8711 94) rotate(33.1451)"
          />
        </ClipPath>

        {/* circular mask for first profile photo */}
        <ClipPath id="pw_img0">
          <Rect x="1.5" y="13.5" width="83" height="83" rx="41.5" />
        </ClipPath>

        {/* circular mask for second profile photo */}
        <ClipPath id="pw_img1">
          <Rect x="76.5" y="52.5" width="83" height="83" rx="41.5" />
        </ClipPath>
      </Defs>

      {/* Decorative wing 1 — top-right, rotate(-148°) */}
      <G clipPath="url(#pw_clip0)">
        <Path
          d="M86.8822 24.4237C87.6825 23.1379 88.6754 21.9894 89.8034 21.0446C90.9314 20.0998 92.1722 19.3774 93.4539 18.9193L114.833 11.0362C115.011 10.9704 115.192 10.9426 115.365 10.9546C115.538 10.9665 115.699 11.0179 115.84 11.1058C115.98 11.1936 116.097 11.3162 116.184 11.4663C116.27 11.6164 116.325 11.791 116.344 11.9801L118.63 34.6513C118.927 37.3859 118.184 40.3799 116.565 42.9748C114.945 45.5696 112.581 47.5527 109.994 48.4878C107.406 49.4228 104.806 49.2332 102.766 47.9608C100.726 46.6883 99.4132 44.4371 99.1161 41.7025L98.6734 38.5778L95.6547 39.549C93.7266 40.2391 91.7778 40.3097 90.0545 39.7518C88.3312 39.1939 86.9106 38.0325 85.972 36.4142C85.0335 34.796 84.619 32.7934 84.781 30.6593C84.943 28.5253 85.6742 26.3554 86.8822 24.4237Z"
          fill="#FFE6EE"
        />
      </G>

      {/* Decorative wing 2 — bottom-left, rotate(33.15°) */}
      <G clipPath="url(#pw_clip1)">
        <Path
          d="M74.2889 125.19C73.4631 126.46 72.4475 127.588 71.3008 128.51C70.1541 129.432 68.8992 130.13 67.6085 130.562L46.0761 138.016C45.8966 138.079 45.7152 138.103 45.5427 138.087C45.3701 138.072 45.2098 138.017 45.071 137.927C44.9322 137.836 44.8177 137.711 44.7342 137.559C44.6508 137.408 44.5999 137.232 44.5847 137.042L42.7515 114.33C42.5091 111.59 43.3118 108.611 44.9831 106.049C46.6543 103.488 49.0572 101.552 51.6631 100.669C54.269 99.7858 56.8645 100.027 58.8786 101.34C60.8927 102.653 62.1604 104.93 62.4029 107.67L62.783 110.803L65.8205 109.893C67.762 109.241 69.7118 109.209 71.4236 109.802C73.1354 110.394 74.5325 111.583 75.4386 113.22C76.3446 114.857 76.7189 116.867 76.5143 118.998C76.3097 121.128 75.5353 123.283 74.2889 125.19Z"
          fill="#FFE6EE"
        />
      </G>

      {/* Profile 1 — Partner.png clipped to circle, then stroke on top */}
      <G clipPath="url(#pw_img0)">
        <SvgImage
          x="1.5"
          y="13.5"
          width="83"
          height="83"
          href={require("../assets/images/image3.png")}
          preserveAspectRatio="xMidYMid slice"
        />
      </G>
      <Rect
        x="1.5"
        y="13.5"
        width="83"
        height="83"
        rx="41.5"
        fill="none"
        stroke="#FFB3CD"
        strokeWidth="3"
      />

      {/* Profile 2 — Partner1.png clipped to circle, then stroke on top */}
      <G clipPath="url(#pw_img1)">
        <SvgImage
          x="76.5"
          y="52.5"
          width="83"
          height="83"
          href={require("../assets/images/image4.png")}
          preserveAspectRatio="xMidYMid slice"
        />
      </G>
      <Rect
        x="76.5"
        y="52.5"
        width="83"
        height="83"
        rx="41.5"
        fill="none"
        stroke="#FFB3CD"
        strokeWidth="3"
      />
    </Svg>
  );
}

function WatermarkLogo({ screenWidth, screenHeight }: { screenWidth: number; screenHeight: number }) {
  const svgW = screenWidth;
  const svgH = (316 / 393) * svgW;
  const top = (screenHeight - svgH) / 2 + 22;

  return (
    <Svg
      width={svgW}
      height={svgH}
      viewBox="0 0 393 316"
      style={{ position: "absolute", left: 0, top }}
    >
      <Defs>
        <ClipPath id="wm_c0">
          <Rect width={90.9629} height={92.3838} x={253.047} y={35.5312} fill="white" />
        </ClipPath>
        <ClipPath id="wm_c1">
          <Rect width={252.991} height={121.283} x={-71} y={194.715} fill="white" />
        </ClipPath>
        <ClipPath id="wm_c2">
          <Rect width={251.095} height={121.283} x={213.738} y={194.715} fill="white" />
        </ClipPath>
        <ClipPath id="wm_c3">
          <Rect width={90.9629} height={92.3838} x={50.2891} y={35.5312} fill="white" />
        </ClipPath>
        <ClipPath id="wm_c4">
          <Rect width={130.759} height={230.249} x={130.348} y={0} fill="white" />
        </ClipPath>
        <ClipPath id="wm_c5">
          <Rect width={232.619} height={156.342} x={-41.6289} y={127.918} fill="white" />
        </ClipPath>

        <Mask id="wm_m0" maskUnits="userSpaceOnUse" x={253} y={35} width={92} height={93}>
          <G clipPath="url(#wm_c0)">
            <Path d="M337.849 105.649C337.375 94.2787 335.48 82.9084 333.585 71.5381C332.163 63.0104 330.742 54.9564 328.847 47.3761C328.373 47.3761 328.373 47.3761 327.9 47.3761C313.687 51.64 299.474 56.8514 285.734 63.0103C274.838 67.2742 264.415 72.9593 253.992 78.1707C272.469 61.1153 296.631 48.3237 320.319 40.2697C325.057 38.8484 330.268 37.4271 335.48 36.0059C336.427 40.7435 337.849 45.9549 338.796 51.1663C341.165 63.0103 342.586 74.8544 343.06 86.6985C343.534 100.438 342.586 114.177 339.27 127.442C338.796 120.336 338.796 112.755 337.849 105.649Z" fill="white" />
          </G>
        </Mask>

        <Mask id="wm_m1" maskUnits="userSpaceOnUse" x={-71} y={194} width={253} height={122}>
          <G clipPath="url(#wm_c1)">
            <Path d="M-67.6859 216.982C-53.4729 208.455 -38.3124 201.822 -22.6782 196.61L-20.7832 196.137C-23.152 197.084 -25.0471 198.032 -26.9421 198.979C-39.26 205.138 -51.1041 211.771 -62.9482 219.825C-53.9467 232.143 -43.5239 243.987 -32.6273 254.883C-21.2569 265.78 -8.93906 276.203 4.80013 284.73C28.9622 300.365 53.5979 308.419 82.9714 307.945C101.922 307.471 120.873 304.155 138.876 298.469C153.562 294.206 167.302 288.52 180.567 282.362C179.146 283.783 176.777 285.204 174.882 286.152C140.771 306.997 98.1319 320.263 57.8619 314.577C27.5409 310.787 0.536263 295.627 -22.2045 276.203C-40.2075 260.095 -55.8418 241.144 -68.6335 220.299L-70.0547 217.93L-67.6859 216.982Z" fill="white" />
          </G>
        </Mask>

        <Mask id="wm_m2" maskUnits="userSpaceOnUse" x={213} y={194} width={252} height={122}>
          <G clipPath="url(#wm_c2)">
            <Path d="M294.278 306.524C311.334 308.892 329.337 308.419 345.919 304.155C370.081 297.996 391.874 285.204 410.825 269.57C428.354 254.883 443.988 237.828 457.253 219.825C443.988 210.823 429.775 202.769 415.562 196.137C431.67 201.348 447.304 207.981 461.991 216.982L464.36 217.93L462.939 220.299C445.409 249.672 421.721 275.255 392.348 293.732C375.766 304.628 356.815 312.209 336.917 314.577C299.49 319.789 261.589 308.892 228.899 291.837C224.635 288.994 219.897 286.625 215.633 283.783C214.686 283.309 214.212 282.835 213.738 282.362C227.004 288.994 241.217 294.206 255.43 298.469C267.748 302.26 281.013 305.102 294.278 306.524Z" fill="white" />
          </G>
        </Mask>

        <Mask id="wm_m3" maskUnits="userSpaceOnUse" x={50} y={35} width={92} height={93}>
          <G clipPath="url(#wm_c3)">
            <Path d="M89.1378 54.9564C81.0838 52.1138 73.5036 49.745 65.4496 47.3761V47.8499C61.6595 62.5366 59.2907 77.697 57.3956 92.3836C56.4481 104.228 55.5005 115.598 55.0268 127.442C49.3416 102.806 50.2892 75.8019 55.5006 51.1663C56.4481 45.9549 57.8693 40.7435 59.2906 36.0059C64.0283 37.4271 69.2397 38.8484 73.9774 40.2697C85.3477 44.0598 96.2443 48.7974 106.667 54.4826C118.985 61.1153 130.355 68.6955 140.304 78.1707C133.672 74.8544 127.513 71.5381 120.88 68.6955C110.457 63.4841 100.034 59.2202 89.1378 54.9564Z" fill="white" />
          </G>
        </Mask>

        <Mask id="wm_m4" maskUnits="userSpaceOnUse" x={202} y={127} width={236} height={158}>
          <Path d="M203.293 273.364C241.668 280.944 282.412 281.892 319.839 269.574C363.425 255.361 393.746 218.408 412.223 177.664C414.118 173.874 416.013 169.61 417.909 165.346C420.751 158.24 423.12 150.66 425.489 143.553C416.487 141.184 407.012 139.289 398.01 137.868C369.584 134.078 340.211 134.078 312.259 142.132C303.731 144.501 295.203 147.817 287.149 151.607C278.622 155.871 271.041 160.609 263.935 166.294C271.041 159.661 279.569 153.028 288.097 148.291C293.308 145.448 298.994 142.606 304.205 140.237C332.631 129.34 363.425 126.971 393.273 129.814C407.959 130.762 422.172 133.604 435.912 137.394C432.595 151.607 427.384 165.82 421.699 179.559C410.328 204.669 394.694 228.831 373.848 247.307C362.478 257.73 349.686 265.784 335.473 271.469C302.784 285.208 265.356 286.156 230.771 279.997C222.244 278.576 213.716 276.681 205.662 274.312L203.293 273.364Z" fill="white" />
        </Mask>

        <Mask id="wm_m5" maskUnits="userSpaceOnUse" x={130} y={0} width={132} height={231}>
          <G clipPath="url(#wm_c4)">
            <Path d="M134.611 163.922C123.241 115.124 144.56 65.379 174.408 27.0042C181.04 18.0027 189.094 9.00124 197.148 0.947266C205.676 9.94876 213.73 18.9502 220.837 28.4255C227.469 37.427 233.628 46.9023 238.84 56.3775C249.262 75.8018 257.316 97.1212 259.685 119.388C260.159 122.231 260.159 125.547 260.633 128.863C260.633 131.706 260.633 135.022 260.633 137.865C260.159 130.285 259.211 122.231 257.316 114.65C255.895 108.018 254 101.385 251.631 94.7523C247.367 81.9607 241.682 70.1167 235.049 58.7463C228.891 48.7973 222.258 39.3221 215.151 30.3206C212.783 27.0042 210.414 24.1616 207.571 21.319C204.255 17.0552 200.938 13.2651 197.148 9.94873C166.827 41.6909 141.244 83.382 136.98 127.916C135.559 141.181 136.506 154.92 139.349 167.712C144.087 189.979 153.088 210.824 164.932 230.249C152.614 213.193 143.139 194.716 136.98 174.344C136.033 171.028 135.085 167.238 134.611 163.922Z" fill="white" />
          </G>
        </Mask>

        <Mask id="wm_m6" maskUnits="userSpaceOnUse" x={163} y={136} width={99} height={140}>
          <Path d="M164.938 230.251C168.728 235.462 172.518 240.674 176.782 245.411C183.414 252.992 190.047 260.098 197.154 267.205C197.627 266.731 198.101 265.783 198.575 265.309C210.419 252.044 221.316 237.831 230.791 222.671C246.425 197.088 258.269 168.188 260.638 137.867C262.533 164.872 254.479 192.35 241.687 215.564C233.633 231.198 223.684 245.411 212.314 258.677C207.576 264.362 202.365 269.573 197.154 274.311L195.258 272.416C189.573 266.257 183.888 259.624 178.677 252.518C173.465 245.411 168.728 237.831 164.938 230.251Z" fill="white" />
        </Mask>

        <Mask id="wm_m7" maskUnits="userSpaceOnUse" x={-42} y={127} width={233} height={158}>
          <G clipPath="url(#wm_c5)">
            <Path d="M61.1781 272.416C24.2244 258.203 -3.25397 226.935 -20.7833 192.35C-23.6259 187.612 -25.9947 182.401 -27.8898 177.19C-33.5749 164.398 -38.3126 151.133 -41.6289 137.393C-25.9947 133.13 -9.88667 130.287 6.69511 129.339C35.121 126.971 64.4945 129.813 91.0253 140.71C94.3416 142.131 98.1317 144.026 101.448 145.447C103.343 146.395 105.712 147.816 107.133 148.764C115.661 153.975 123.241 159.66 130.348 166.293C123.241 160.608 115.661 155.87 107.607 151.606C99.5531 147.816 91.0253 144.5 82.0237 142.131C55.0191 134.551 26.5932 134.077 -0.885159 137.867C-10.8342 138.815 -21.257 140.71 -31.2061 143.552C-29.7848 147.816 -28.3635 152.08 -26.4684 156.818C-20.3095 173.873 -12.2555 190.455 -2.78019 206.089C11.4328 227.408 29.4358 246.833 51.7028 259.624C71.6009 270.521 94.3416 276.206 117.082 278.101C129.4 279.049 141.718 279.049 154.036 278.575C166.354 277.627 178.672 275.732 190.99 273.363L188.621 274.311C188.147 274.311 187.2 274.785 186.252 274.785C181.988 276.206 177.25 277.154 172.987 278.101C136.033 286.155 96.7105 286.155 61.1781 272.416Z" fill="white" />
          </G>
        </Mask>
      </Defs>

      <G opacity={0.2}>
        <G mask="url(#wm_m0)">
          <Path d="M-73.2227 -1.75977H543.641V398.718H-73.2227V-1.75977Z" fill="white" />
        </G>
        <G mask="url(#wm_m1)">
          <Path d="M-73.2227 -1.75977H543.641V398.718H-73.2227V-1.75977Z" fill="white" />
        </G>
        <G mask="url(#wm_m2)">
          <Path d="M-73.2227 -1.75977H543.641V398.718H-73.2227V-1.75977Z" fill="white" />
        </G>
        <G mask="url(#wm_m3)">
          <Path d="M-73.2227 -1.75977H543.641V398.718H-73.2227V-1.75977Z" fill="white" />
        </G>
        <G mask="url(#wm_m4)">
          <Path d="M-73.2227 -1.75977H543.641V398.718H-73.2227V-1.75977Z" fill="white" />
        </G>
        <G mask="url(#wm_m5)">
          <Path d="M-73.2031 -1.75977H543.66V398.718H-73.2031V-1.75977Z" fill="white" />
        </G>
        <G mask="url(#wm_m6)">
          <Path d="M-73.2227 -1.75977H543.641V398.718H-73.2227V-1.75977Z" fill="white" />
        </G>
        <G mask="url(#wm_m7)">
          <Path d="M-73.2227 -1.75977H543.641V398.718H-73.2227V-1.75977Z" fill="white" />
        </G>
      </G>
    </Svg>
  );
}

export default function PartnerWelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: "#FF4081", overflow: "hidden" }}>
      {/* Watermark logo */}
      <WatermarkLogo screenWidth={width} screenHeight={height} />

      {/* Back arrow */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.7}
        style={{
          position: "absolute",
          top: insets.top + 16,
          left: 20,
          zIndex: 10,
        }}
      >
        <Feather name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Title + subtitle */}
      <View
        style={{
          marginTop: insets.top + 63,
          paddingHorizontal: 31,
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text
          className="font-inter font-medium text-white text-center"
          style={{ fontSize: 24, lineHeight: 29 }}
        >
          Welcome to Satsflo
        </Text>
        <Text
          className="font-inter text-center"
          style={{ fontSize: 16, lineHeight: 24, color: "#FAFAFA" }}
        >
          Support someone you care about with shared cycle insights, thoughtful
          reminders and send gift.
        </Text>
      </View>

      {/*
        Frame 1686553425 — SVG is 162×150, centred horizontally.
        top:406/852 ≈ 0.476 matches Figma baseline.
      */}
      <View
        style={{
          position: "absolute",
          left: (width - 162) / 2,
          top: height * 0.476,
        }}
      >
        <PartnerProfiles />
      </View>

      <View style={{ flex: 1 }} />

      {/* Continue button */}
      <View style={{ alignItems: "center", paddingBottom: 28 }}>
        <TouchableOpacity
          onPress={() => router.push("/enter-partner-code")}
          activeOpacity={0.8}
          style={{
            width: 250,
            height: 56,
            borderRadius: 1000,
            backgroundColor: "#FF82AD",
            borderWidth: 0.5,
            borderColor: "#FF99BC",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            className="font-inter font-medium text-white"
            style={{ fontSize: 15 }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Home indicator */}
      <View
        style={{
          backgroundColor: "#FF3378",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8) + 3,
        }}
      />
    </View>
  );
}
