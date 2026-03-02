import { BottomNavigation } from "@/components/home/bottom-navigation";
import { useTheme } from "@/context/theme-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

function InviteIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10.2786 12.2264C10.3278 12.3019 10.3557 12.3892 10.3594 12.4792C10.3631 12.5692 10.3423 12.6585 10.2995 12.7377C10.2566 12.8169 10.1931 12.883 10.1157 12.9291C10.0383 12.9752 9.94993 12.9996 9.85986 12.9996H0.638611C0.548546 12.9996 0.460156 12.9752 0.38278 12.9291C0.305403 12.883 0.241914 12.8169 0.19902 12.7377C0.156125 12.6585 0.135418 12.5692 0.139087 12.4792C0.142755 12.3892 0.170663 12.3019 0.219861 12.2264C0.923677 11.1431 1.95892 10.3163 3.17111 9.86957C2.50098 9.42344 1.99222 8.77349 1.72005 8.01585C1.44788 7.25821 1.42675 6.43309 1.65979 5.66251C1.89284 4.89193 2.36768 4.2168 3.01409 3.73696C3.66051 3.25712 4.44419 2.99805 5.24924 2.99805C6.05428 2.99805 6.83796 3.25712 7.48438 3.73696C8.1308 4.2168 8.60564 4.89193 8.83868 5.66251C9.07172 6.43309 9.0506 7.25821 8.77843 8.01585C8.50625 8.77349 7.99749 9.42344 7.32736 9.86957C8.53955 10.3163 9.57479 11.1431 10.2786 12.2264Z"
        fill="#FF4081"
      />
      <Path
        d="M15.773 12.2171C15.069 11.1383 14.0361 10.3151 12.8274 9.86957C13.6185 9.33667 14.1768 8.52232 14.3886 7.59228C14.6005 6.66225 14.45 5.68643 13.9677 4.86346C13.4855 4.04049 12.7078 3.43222 11.7928 3.16246C10.8779 2.89271 9.89458 2.98174 9.04299 3.41144C9.01042 3.42826 8.98195 3.45202 8.9596 3.48106C8.93724 3.5101 8.92154 3.5437 8.91361 3.57948C8.90568 3.61526 8.90571 3.65234 8.9137 3.68811C8.92169 3.72387 8.93745 3.75744 8.95986 3.78644C9.59309 4.57632 9.95675 5.54822 9.99758 6.55976C10.0384 7.57131 9.75425 8.56935 9.18674 9.40769C9.15005 9.46248 9.1365 9.52954 9.14903 9.59427C9.16155 9.659 9.19914 9.71617 9.25361 9.75332C9.99356 10.2697 10.627 10.924 11.1192 11.6802C11.3178 11.9842 11.3989 12.3501 11.3474 12.7096C11.3416 12.7453 11.3436 12.7819 11.3533 12.8168C11.3631 12.8517 11.3803 12.884 11.4038 12.9116C11.4273 12.9392 11.4565 12.9614 11.4893 12.9765C11.5222 12.9917 11.558 12.9996 11.5942 12.9996H15.363C15.4731 12.9996 15.5801 12.9633 15.6675 12.8963C15.7548 12.8293 15.8176 12.7353 15.8461 12.6289C15.8635 12.559 15.866 12.4862 15.8534 12.4152C15.8408 12.3443 15.8134 12.2768 15.773 12.2171Z"
        fill="#FFB4CD"
      />
    </Svg>
  );
}

function ReminderIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.0003 4.44401C13.8826 4.50496 13.7456 4.51668 13.6192 4.4766C13.4929 4.43652 13.3876 4.34791 13.3266 4.23026C12.8493 3.28744 12.127 2.49057 11.2353 1.92338C11.1798 1.88834 11.1317 1.84269 11.0937 1.78905C11.0558 1.7354 11.0288 1.67482 11.0143 1.61074C10.9998 1.54667 10.9981 1.48037 11.0092 1.41562C11.0203 1.35087 11.044 1.28895 11.0791 1.23338C11.1141 1.17782 11.1598 1.1297 11.2134 1.09178C11.2671 1.05385 11.3277 1.02686 11.3917 1.01236C11.4558 0.997846 11.5221 0.996099 11.5869 1.00721C11.6516 1.01833 11.7135 1.04209 11.7691 1.07713C12.8082 1.74247 13.652 2.67186 14.2141 3.77026C14.275 3.88796 14.2868 4.02504 14.2467 4.15138C14.2066 4.27772 14.118 4.38297 14.0003 4.44401ZM2.23221 4.50026C2.32381 4.50022 2.41365 4.47502 2.4919 4.4274C2.57015 4.37979 2.63383 4.31159 2.67596 4.23026C3.15321 3.28744 3.8756 2.49057 4.76721 1.92338C4.87943 1.8526 4.95894 1.74014 4.98824 1.61074C5.01754 1.48134 4.99424 1.3456 4.92346 1.23338C4.85268 1.12116 4.74022 1.04166 4.61082 1.01236C4.48142 0.983053 4.34568 1.00635 4.23346 1.07713C3.19434 1.74247 2.35057 2.67186 1.78846 3.77026C1.74899 3.84646 1.72979 3.93154 1.73271 4.0173C1.73564 4.10307 1.76059 4.18664 1.80517 4.25998C1.84974 4.33331 1.91245 4.39393 1.98724 4.43602C2.06203 4.4781 2.14639 4.50022 2.23221 4.50026ZM13.8635 10.9965C13.952 11.1484 13.999 11.321 13.9996 11.4968C14.0002 11.6727 13.9544 11.8456 13.8669 11.9981C13.7794 12.1506 13.6532 12.2773 13.501 12.3655C13.3489 12.4536 13.1762 12.5001 13.0003 12.5003H10.4503C10.3356 13.0654 10.029 13.5735 9.58247 13.9384C9.13596 14.3034 8.57702 14.5028 8.00034 14.5028C7.42366 14.5028 6.86471 14.3034 6.41821 13.9384C5.9717 13.5735 5.6651 13.0654 5.55034 12.5003H3.00034C2.8246 12.4999 2.65206 12.4533 2.50009 12.365C2.34812 12.2767 2.2221 12.15 2.13471 11.9975C2.04732 11.8451 2.00166 11.6722 2.00232 11.4965C2.00298 11.3208 2.04993 11.1483 2.13846 10.9965C2.70159 10.0246 3.00034 8.64276 3.00034 7.00026C3.00034 5.67418 3.52712 4.40241 4.4648 3.46472C5.40249 2.52704 6.67426 2.00026 8.00034 2.00026C9.32642 2.00026 10.5982 2.52704 11.5359 3.46472C12.4736 4.40241 13.0003 5.67418 13.0003 7.00026C13.0003 8.64213 13.2991 10.024 13.8635 10.9965ZM9.41409 12.5003H6.58659C6.69018 12.7924 6.88172 13.0453 7.13488 13.2241C7.38804 13.4029 7.69038 13.4989 8.00034 13.4989C8.31029 13.4989 8.61264 13.4029 8.8658 13.2241C9.11896 13.0453 9.3105 12.7924 9.41409 12.5003Z"
        fill="#ED7770"
      />
    </Svg>
  );
}

function LutealIcon() {
  return (
    <Svg width={16} height={17} viewBox="0 0 16 17" fill="none">
      <Defs>
        <LinearGradient
          id="luteal_grad"
          x1="8"
          y1="0.5"
          x2="8"
          y2="16.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FF4081" />
          <Stop offset="1" stopColor="#635497" />
        </LinearGradient>
      </Defs>
      <Path
        d="M5.75236 2.9369C5.33858 1.91276 5.8368 0.719191 6.93147 0.571674C8.0837 0.416401 9.26413 0.513061 10.389 0.865035C12.1554 1.41774 13.6755 2.56582 14.6903 4.11366C15.7051 5.66149 16.1518 7.51331 15.9543 9.35359C15.7568 11.1939 14.9274 12.9087 13.6073 14.206C12.2872 15.5033 10.5581 16.3027 8.71463 16.468C6.87118 16.6334 5.02744 16.1544 3.49756 15.1127C1.96767 14.0711 0.846296 12.5311 0.324502 10.7554C-0.00778586 9.62454 -0.0838283 8.4426 0.0915312 7.29326C0.258131 6.20132 1.46021 5.72402 2.47697 6.15561C3.49373 6.5872 3.91071 7.79448 4.01941 8.89369C4.04385 9.14084 4.0914 9.38659 4.16225 9.62769C4.42315 10.5156 4.98384 11.2855 5.74878 11.8064C6.51372 12.3272 7.43559 12.5667 8.35731 12.484C9.27904 12.4013 10.1436 12.0016 10.8036 11.353C11.4637 10.7044 11.8784 9.84693 11.9772 8.92679C12.0759 8.00665 11.8525 7.08075 11.3451 6.30683C10.8377 5.53291 10.0777 4.95887 9.1945 4.68252C8.95467 4.60747 8.70979 4.55564 8.4631 4.52689C7.36596 4.39902 6.16614 3.96104 5.75236 2.9369Z"
        fill="url(#luteal_grad)"
      />
    </Svg>
  );
}

function CycleIcon() {
  return (
    <Svg width={16} height={17} viewBox="0 0 16 17" fill="none">
      <Path
        d="M5.75236 2.9369C5.33858 1.91276 5.8368 0.719191 6.93147 0.571674C8.0837 0.416401 9.26413 0.513061 10.389 0.865035C12.1554 1.41774 13.6755 2.56582 14.6903 4.11366C15.7051 5.66149 16.1518 7.51331 15.9543 9.35359C15.7568 11.1939 14.9274 12.9087 13.6073 14.206C12.2872 15.5033 10.5581 16.3027 8.71463 16.468C6.87118 16.6334 5.02744 16.1544 3.49756 15.1127C1.96767 14.0711 0.846296 12.5311 0.324502 10.7554C-0.00778586 9.62454 -0.0838283 8.4426 0.0915312 7.29326C0.258131 6.20132 1.46021 5.72402 2.47697 6.15561C3.49373 6.5872 3.91071 7.79448 4.01941 8.89369C4.04385 9.14084 4.0914 9.38659 4.16225 9.62769C4.42315 10.5156 4.98384 11.2855 5.74878 11.8064C6.51372 12.3272 7.43559 12.5667 8.35731 12.484C9.27904 12.4013 10.1436 12.0016 10.8036 11.353C11.4637 10.7044 11.8784 9.84693 11.9772 8.92679C12.0759 8.00665 11.8525 7.08075 11.3451 6.30683C10.8377 5.53291 10.0777 4.95887 9.1945 4.68252C8.95467 4.60747 8.70979 4.55564 8.4631 4.52689C7.36596 4.39902 6.16614 3.96104 5.75236 2.9369Z"
        fill="#A68CFD"
      />
    </Svg>
  );
}

function PeriodIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10.875 2.98423C10.103 2.09263 9.23409 1.28977 8.28438 0.590485C8.2003 0.531592 8.10015 0.5 7.9975 0.5C7.89485 0.5 7.7947 0.531592 7.71063 0.590485C6.76266 1.29006 5.89545 2.09291 5.125 2.98423C3.40688 4.95736 2.5 7.03736 2.5 8.99986C2.5 10.4586 3.07946 11.8575 4.11091 12.8889C5.14236 13.9204 6.54131 14.4999 8 14.4999C9.45869 14.4999 10.8576 13.9204 11.8891 12.8889C12.9205 11.8575 13.5 10.4586 13.5 8.99986C13.5 7.03736 12.5931 4.95736 10.875 2.98423Z"
        fill="#FF4081"
      />
    </Svg>
  );
}

function RateAppIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.9483 6.07866C14.8858 5.88649 14.7678 5.71712 14.6092 5.59188C14.4506 5.46665 14.2585 5.39116 14.0571 5.37491L10.3696 5.07741L8.9458 1.63429C8.86881 1.44667 8.73776 1.28619 8.56932 1.17325C8.40088 1.06031 8.20267 1 7.99987 1C7.79707 1 7.59885 1.06031 7.43041 1.17325C7.26197 1.28619 7.13093 1.44667 7.05393 1.63429L5.63143 5.07679L1.94205 5.37491C1.74029 5.39198 1.54805 5.4682 1.38941 5.59404C1.23078 5.71988 1.11281 5.88973 1.05028 6.08232C0.987751 6.27491 0.983448 6.48167 1.03791 6.67669C1.09237 6.87172 1.20317 7.04633 1.35643 7.17866L4.16893 9.60554L3.31205 13.2343C3.26478 13.4313 3.27695 13.6379 3.34704 13.828C3.41713 14.0181 3.54199 14.1832 3.70584 14.3024C3.8697 14.4216 4.0652 14.4895 4.26765 14.4976C4.4701 14.5058 4.67042 14.4537 4.8433 14.348L7.99955 12.4055L11.1577 14.348C11.3305 14.4531 11.5306 14.5047 11.7327 14.4962C11.9348 14.4878 12.1299 14.4198 12.2934 14.3007C12.4569 14.1816 12.5816 14.0168 12.6516 13.8271C12.7217 13.6373 12.734 13.431 12.6871 13.2343L11.8271 9.60491L14.6396 7.17804C14.7941 7.04593 14.9059 6.87093 14.9608 6.67522C15.0158 6.47951 15.0114 6.27189 14.9483 6.07866ZM13.9896 6.42054L10.9458 9.04554C10.8764 9.10537 10.8248 9.18312 10.7965 9.27031C10.7683 9.35749 10.7646 9.45076 10.7858 9.53991L11.7158 13.4649C11.7182 13.4703 11.7184 13.4764 11.7165 13.482C11.7145 13.4876 11.7105 13.4922 11.7052 13.4949C11.6939 13.5037 11.6908 13.5018 11.6814 13.4949L8.26143 11.3918C8.18257 11.3437 8.09192 11.3184 7.99955 11.3187V1.99991C8.01455 1.99991 8.01643 2.00491 8.02143 2.01616L9.56205 5.74116C9.59722 5.82631 9.65523 5.90008 9.72967 5.95434C9.80412 6.00861 9.89211 6.04125 9.98393 6.04866L13.9783 6.37116C13.9883 6.37116 13.9939 6.37116 13.9996 6.38929C14.0052 6.40741 13.9996 6.41429 13.9896 6.42054Z"
        fill="#FF8400"
      />
    </Svg>
  );
}

function PrivacyIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 7C7.57975 7.00014 7.17358 7.15151 6.85574 7.42644C6.53789 7.70137 6.3296 8.08149 6.26892 8.49734C6.20825 8.91319 6.29925 9.33698 6.52529 9.69127C6.75133 10.0456 7.09731 10.3067 7.5 10.4269V11.5C7.5 11.6326 7.55268 11.7598 7.64645 11.8536C7.74021 11.9473 7.86739 12 8 12C8.13261 12 8.25979 11.9473 8.35355 11.8536C8.44732 11.7598 8.5 11.6326 8.5 11.5V10.4269C8.90269 10.3067 9.24867 10.0456 9.47471 9.69127C9.70075 9.33698 9.79175 8.91319 9.73108 8.49734C9.6704 8.08149 9.46211 7.70137 9.14426 7.42644C8.82642 7.15151 8.42025 7.00014 8 7ZM8 9.5C7.85166 9.5 7.70666 9.45601 7.58332 9.3736C7.45999 9.29119 7.36386 9.17406 7.30709 9.03701C7.25032 8.89997 7.23547 8.74917 7.26441 8.60368C7.29335 8.4582 7.36478 8.32456 7.46967 8.21967C7.57456 8.11478 7.7082 8.04335 7.85368 8.01441C7.99917 7.98547 8.14997 8.00033 8.28701 8.05709C8.42406 8.11386 8.54119 8.20999 8.6236 8.33332C8.70601 8.45666 8.75 8.60166 8.75 8.75C8.75 8.94891 8.67098 9.13968 8.53033 9.28033C8.38968 9.42098 8.19891 9.5 8 9.5ZM13 5H11V3.5C11 2.70435 10.6839 1.94129 10.1213 1.37868C9.55871 0.81607 8.79565 0.5 8 0.5C7.20435 0.5 6.44129 0.81607 5.87868 1.37868C5.31607 1.94129 5 2.70435 5 3.5V5H3C2.73478 5 2.48043 5.10536 2.29289 5.29289C2.10536 5.48043 2 5.73478 2 6V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H13C13.2652 14 13.5196 13.8946 13.7071 13.7071C13.8946 13.5196 14 13.2652 14 13V6C14 5.73478 13.8946 5.48043 13.7071 5.29289C13.5196 5.10536 13.2652 5 13 5ZM6 3.5C6 2.96957 6.21071 2.46086 6.58579 2.08579C6.96086 1.71071 7.46957 1.5 8 1.5C8.53043 1.5 9.03914 1.71071 9.41421 2.08579C9.78929 2.46086 10 2.96957 10 3.5V5H6V3.5ZM13 13H3V6H13V13Z"
        fill="black"
      />
    </Svg>
  );
}

function ContactSupportIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.5 7.99979V12.9998C14.5 13.6628 14.2366 14.2987 13.7678 14.7676C13.2989 15.2364 12.663 15.4998 12 15.4998H8.5C8.36739 15.4998 8.24022 15.4471 8.14645 15.3533C8.05268 15.2596 8 15.1324 8 14.9998C8 14.8672 8.05268 14.74 8.14645 14.6462C8.24022 14.5525 8.36739 14.4998 8.5 14.4998H12C12.3978 14.4998 12.7794 14.3418 13.0607 14.0605C13.342 13.7791 13.5 13.3976 13.5 12.9998H12C11.6022 12.9998 11.2206 12.8418 10.9393 12.5605C10.658 12.2791 10.5 11.8976 10.5 11.4998V8.99979C10.5 8.60197 10.658 8.22044 10.9393 7.93913C11.2206 7.65783 11.6022 7.49979 12 7.49979H13.4781C13.3835 6.46038 12.9951 5.46935 12.3582 4.64245C11.7214 3.81555 10.8624 3.18692 9.88164 2.83C8.90085 2.47308 7.83875 2.40259 6.8194 2.62677C5.80005 2.85096 4.86553 3.36056 4.125 4.09604C3.20416 5.00474 2.6362 6.2111 2.5225 7.49979H4C4.39783 7.49979 4.77936 7.65783 5.06066 7.93913C5.34197 8.22044 5.5 8.60197 5.5 8.99979V11.4998C5.5 11.8976 5.34197 12.2791 5.06066 12.5605C4.77936 12.8418 4.39783 12.9998 4 12.9998H3C2.60218 12.9998 2.22064 12.8418 1.93934 12.5605C1.65804 12.2791 1.5 11.8976 1.5 11.4998V7.99979C1.5014 6.71223 1.88476 5.45403 2.60156 4.38444C3.31836 3.31485 4.33638 2.48196 5.52674 1.9912C6.71711 1.50044 8.02632 1.37386 9.28866 1.6275C10.551 1.88114 11.7097 2.50358 12.6181 3.41604C13.2179 4.01873 13.6929 4.73385 14.0158 5.52041C14.3387 6.30697 14.5033 7.14953 14.5 7.99979Z"
        fill="#0134E4"
      />
    </Svg>
  );
}

function WalletIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M13.5 4H3.5C3.36739 4 3.24021 3.94732 3.14645 3.85355C3.05268 3.75979 3 3.63261 3 3.5C3 3.36739 3.05268 3.24021 3.14645 3.14645C3.24021 3.05268 3.36739 3 3.5 3H12C12.1326 3 12.2598 2.94732 12.3536 2.85355C12.4473 2.75979 12.5 2.63261 12.5 2.5C12.5 2.36739 12.4473 2.24021 12.3536 2.14645C12.2598 2.05268 12.1326 2 12 2H3.5C3.10218 2 2.72064 2.15804 2.43934 2.43934C2.15804 2.72064 2 3.10218 2 3.5V11.5C2 11.8978 2.15804 12.2794 2.43934 12.5607C2.72064 12.842 3.10218 13 3.5 13H13.5C13.7652 13 14.0196 12.8946 14.2071 12.7071C14.3946 12.5196 14.5 12.2652 14.5 12V5C14.5 4.73478 14.3946 4.48043 14.2071 4.29289C14.0196 4.10536 13.7652 4 13.5 4ZM11.25 9C11.1017 9 10.9567 8.95601 10.8333 8.8736C10.71 8.79119 10.6139 8.67406 10.5571 8.53701C10.5003 8.39997 10.4855 8.24917 10.5144 8.10368C10.5434 7.9582 10.6148 7.82456 10.7197 7.71967C10.8246 7.61478 10.9582 7.54335 11.1037 7.51441C11.2492 7.48547 11.4 7.50032 11.537 7.55709C11.6741 7.61386 11.7912 7.70999 11.8736 7.83332C11.956 7.95666 12 8.10166 12 8.25C12 8.44891 11.921 8.63968 11.7803 8.78033C11.6397 8.92098 11.4489 9 11.25 9Z"
        fill="#896024"
      />
    </Svg>
  );
}

function LanguageIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Defs>
        <LinearGradient
          id="lang_grad"
          x1="8.49987"
          y1="1.5"
          x2="8.49987"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FF4081" />
          <Stop offset="1" stopColor="#672699" />
        </LinearGradient>
      </Defs>
      <Path
        d="M15.4469 13.2762L11.9469 6.27625C11.9053 6.19321 11.8415 6.12338 11.7625 6.07457C11.6835 6.02576 11.5925 5.99991 11.4997 5.99991C11.4068 5.99991 11.3158 6.02576 11.2368 6.07457C11.1579 6.12338 11.094 6.19321 11.0525 6.27625L9.69563 8.99062C8.63206 8.93082 7.60875 8.56344 6.75 7.93312C7.75755 6.85716 8.36803 5.46976 8.48063 4H10C10.1326 4 10.2598 3.94732 10.3536 3.85355C10.4473 3.75978 10.5 3.63261 10.5 3.5C10.5 3.36739 10.4473 3.24021 10.3536 3.14645C10.2598 3.05268 10.1326 3 10 3H6.5V2C6.5 1.86739 6.44732 1.74021 6.35355 1.64645C6.25979 1.55268 6.13261 1.5 6 1.5C5.86739 1.5 5.74021 1.55268 5.64645 1.64645C5.55268 1.74021 5.5 1.86739 5.5 2V3H2C1.86739 3 1.74021 3.05268 1.64645 3.14645C1.55268 3.24021 1.5 3.36739 1.5 3.5C1.5 3.63261 1.55268 3.75978 1.64645 3.85355C1.74021 3.94732 1.86739 4 2 4H7.47687C7.36551 5.22541 6.84535 6.37778 6 7.27187C5.47322 6.71604 5.06871 6.05604 4.8125 5.33437C4.79143 5.27141 4.75804 5.21327 4.71426 5.16335C4.67048 5.11343 4.6172 5.07273 4.55753 5.04363C4.49785 5.01452 4.43298 4.99759 4.36669 4.99383C4.3004 4.99006 4.23402 4.99954 4.17144 5.0217C4.10885 5.04386 4.0513 5.07827 4.00216 5.12291C3.95301 5.16755 3.91324 5.22154 3.88518 5.28171C3.85712 5.34189 3.84133 5.40705 3.83872 5.47339C3.83612 5.53973 3.84675 5.60593 3.87 5.66812C4.16829 6.51179 4.63817 7.28449 5.25 7.9375C4.30798 8.62974 3.16902 9.00209 2 9C1.86739 9 1.74021 9.05268 1.64645 9.14645C1.55268 9.24021 1.5 9.36739 1.5 9.5C1.5 9.63261 1.55268 9.75978 1.64645 9.85355C1.74021 9.94732 1.86739 10 2 10C3.45037 10.0016 4.85916 9.51558 6 8.62C6.93098 9.34742 8.04235 9.80782 9.215 9.95187L7.5525 13.2762C7.52312 13.335 7.50559 13.3989 7.50091 13.4644C7.49624 13.5299 7.50451 13.5957 7.52526 13.658C7.56717 13.7838 7.65734 13.8878 7.77594 13.9472C7.89454 14.0065 8.03186 14.0163 8.15768 13.9744C8.28351 13.9325 8.38753 13.8424 8.44687 13.7237L9.30875 12H13.6906L14.5525 13.7237C14.5941 13.8068 14.658 13.8767 14.737 13.9255C14.816 13.9743 14.9071 14.0001 15 14C15.0852 14 15.169 13.9781 15.2434 13.9366C15.3178 13.8951 15.3804 13.8352 15.4252 13.7627C15.4699 13.6902 15.4954 13.6074 15.4992 13.5223C15.503 13.4372 15.485 13.3525 15.4469 13.2762ZM9.80875 11L11.5 7.61812L13.1906 11H9.80875Z"
        fill="url(#lang_grad)"
      />
    </Svg>
  );
}

function MoodsIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM10.25 6C10.3983 6 10.5433 6.04399 10.6667 6.1264C10.79 6.20881 10.8861 6.32594 10.9429 6.46299C10.9997 6.60003 11.0145 6.75083 10.9856 6.89632C10.9567 7.0418 10.8852 7.17544 10.7803 7.28033C10.6754 7.38522 10.5418 7.45665 10.3963 7.48559C10.2508 7.51453 10.1 7.49968 9.96299 7.44291C9.82595 7.38614 9.70881 7.29001 9.6264 7.16668C9.54399 7.04334 9.5 6.89834 9.5 6.75C9.5 6.55109 9.57902 6.36032 9.71967 6.21967C9.86033 6.07902 10.0511 6 10.25 6ZM5.75 6C5.89834 6 6.04334 6.04399 6.16668 6.1264C6.29002 6.20881 6.38615 6.32594 6.44291 6.46299C6.49968 6.60003 6.51453 6.75083 6.48559 6.89632C6.45665 7.0418 6.38522 7.17544 6.28033 7.28033C6.17544 7.38522 6.04181 7.45665 5.89632 7.48559C5.75083 7.51453 5.60003 7.49968 5.46299 7.44291C5.32595 7.38614 5.20881 7.29001 5.1264 7.16668C5.04399 7.04334 5 6.89834 5 6.75C5 6.55109 5.07902 6.36032 5.21967 6.21967C5.36032 6.07902 5.55109 6 5.75 6ZM11 11C10.375 11 10.0594 10.5788 9.85 10.3C9.6625 10.05 9.605 10 9.5 10C9.395 10 9.33938 10.0475 9.15 10.3C8.94063 10.5788 8.625 11 8 11C7.375 11 7.0625 10.5788 6.85 10.3C6.6625 10.05 6.605 10 6.5 10C6.395 10 6.33938 10.0475 6.15 10.3C5.94063 10.5788 5.625 11 5 11C4.86739 11 4.74022 10.9473 4.64645 10.8536C4.55268 10.7598 4.5 10.6326 4.5 10.5C4.5 10.3674 4.55268 10.2402 4.64645 10.1464C4.74022 10.0527 4.86739 10 5 10C5.105 10 5.16063 9.9525 5.35 9.7C5.5625 9.42125 5.875 9 6.5 9C7.125 9 7.4375 9.42125 7.65 9.7C7.8375 9.95 7.895 10 8 10C8.105 10 8.16063 9.9525 8.35 9.7C8.5625 9.42125 8.875 9 9.5 9C10.125 9 10.4406 9.42125 10.65 9.7C10.8375 9.95 10.895 10 11 10C11.1326 10 11.2598 10.0527 11.3536 10.1464C11.4473 10.2402 11.5 10.3674 11.5 10.5C11.5 10.6326 11.4473 10.7598 11.3536 10.8536C11.2598 10.9473 11.1326 11 11 11Z"
        fill="#EA7521"
      />
    </Svg>
  );
}

function SymptomsIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.41282 2.5858C3.36792 3.29038 2.5542 4.29533 2.07843 5.47282C1.60266 6.65031 1.47386 7.94222 1.71867 9.19058C1.96347 10.439 2.57121 11.5872 3.46447 12.4805C4.35773 13.3737 5.50596 13.9815 6.75432 14.2263C8.00267 14.4711 9.29459 14.3423 10.4721 13.8665C11.6496 13.3908 12.6545 12.577 13.3591 11.5321C14.0637 10.4873 14.4449 9.26009 14.4449 8.00226C14.4421 6.31277 13.7694 4.69376 12.5724 3.49671C11.3753 2.29967 9.75629 1.62695 8.06681 1.62418L8 1.5ZM5.5 7.25C5.5 7.05109 5.57902 6.86032 5.71967 6.71967C5.86032 6.57902 6.05109 6.5 6.25 6.5C6.44891 6.5 6.63968 6.57902 6.78033 6.71967C6.92098 6.86032 7 7.05109 7 7.25C7 7.44891 6.92098 7.63968 6.78033 7.78033C6.63968 7.92098 6.44891 8 6.25 8C6.05109 8 5.86032 7.92098 5.71967 7.78033C5.57902 7.63968 5.5 7.44891 5.5 7.25ZM10.7511 10.5865C10.1571 11.2415 9.32161 11.6284 8.43511 11.6563C7.54862 11.6842 6.69077 11.3508 6.05761 10.7351L6.05386 10.7314C5.98899 10.6638 5.95378 10.5736 5.95562 10.4803C5.95746 10.387 5.99621 10.2982 6.06363 10.2332C6.13104 10.1682 6.22162 10.132 6.31504 10.1329C6.40846 10.1337 6.49836 10.1715 6.56461 10.2377L6.56836 10.2414C7.04611 10.7004 7.68711 10.9557 8.35136 10.9532C9.01561 10.9507 9.65464 10.6907 10.1289 10.2283L10.1289 10.2283C10.1952 10.1623 10.285 10.1247 10.3782 10.124C10.4714 10.1234 10.5618 10.1596 10.629 10.2247C10.6963 10.2898 10.7349 10.3785 10.7367 10.4716C10.7385 10.5648 10.7034 10.6549 10.6386 10.7225L10.7511 10.5865ZM10.5 7.25C10.5 7.05109 10.421 6.86032 10.2803 6.71967C10.1397 6.57902 9.94891 6.5 9.75 6.5C9.55109 6.5 9.36032 6.57902 9.21967 6.71967C9.07902 6.86032 9 7.05109 9 7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25Z"
        fill="#FFB71D"
      />
    </Svg>
  );
}

function DropIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Rect
        x={0.5}
        y={0.5}
        width={39}
        height={39}
        rx={19.5}
        stroke="#CC0045"
        strokeDasharray="2 2"
      />
      <Path
        d="M24.3125 12.4764C23.1545 11.1389 21.8511 9.93465 20.4266 8.88573C20.3005 8.79739 20.1502 8.75 19.9963 8.75C19.8423 8.75 19.692 8.79739 19.5659 8.88573C18.144 9.93509 16.8432 11.1394 15.6875 12.4764C13.1103 15.436 11.75 18.556 11.75 21.4998C11.75 23.6878 12.6192 25.7862 14.1664 27.3334C15.7135 28.8806 17.812 29.7498 20 29.7498C22.188 29.7498 24.2865 28.8806 25.8336 27.3334C27.3808 25.7862 28.25 23.6878 28.25 21.4998C28.25 18.556 26.8897 15.436 24.3125 12.4764Z"
        fill="#CC0045"
      />
    </Svg>
  );
}

type TabName = "home" | "calendar" | "add" | "chat" | "settings";

interface SettingRowProps {
  iconName?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  icon?: React.ReactNode;
  label: string;
  rightText?: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingRow({
  iconName,
  iconColor,
  icon,
  label,
  rightText,
  onPress,
  isLast,
}: SettingRowProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between px-3 py-4"
      >
        <View className="flex-row items-center gap-1">
          {icon ?? <Feather name={iconName!} size={16} color={iconColor} />}
          <Text className="text-sm text-[#1E1E1E] leading-[21px]">{label}</Text>
        </View>
        <View className="flex-row items-center gap-[10px]">
          {rightText && (
            <Text className="text-sm text-[#FF4081] leading-[21px]">
              {rightText}
            </Text>
          )}
          <Feather name="chevron-right" size={16} color="#666666" />
        </View>
      </Pressable>
      {!isLast && <View className="h-px bg-[#FFD6E8] mx-3" />}
    </>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <View className="bg-[#FFE6EE] rounded-xl mb-4">{children}</View>;
}

function StarIcon({ filled, size = 36 }: { filled: boolean; size?: number }) {
  const color = filled ? "#FF4283" : "#FFB3CD";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type ThemeOption = "system" | "light" | "dark";

const THEME_OPTIONS: { id: ThemeOption; label: string; subtitle: string }[] = [
  {
    id: "system",
    label: "System default",
    subtitle: "Sync app appearance with your device settings",
  },
  { id: "light", label: "Light mode", subtitle: "Use light mode" },
  { id: "dark", label: "Dark mode", subtitle: "Use dark mode" },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab] = useState<TabName>("settings");
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [rateAppModalVisible, setRateAppModalVisible] = useState(false);
  const [rating, setRating] = useState(3);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { selectedTheme, setSelectedTheme } = useTheme();

  const handleTabPress = (tab: TabName) => {
    switch (tab) {
      case "home":
        router.push("/(tabs)");
        break;
      case "calendar":
        router.push("/calendar");
        break;
      case "add":
        router.push("/add-log");
        break;
      case "chat":
        router.push("/(tabs)/thread");
        break;
      default:
        break;
    }
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Frame 125 — page header */}
      <View
        className="flex-row justify-between items-center gap-[67px] h-10 px-5"
        style={{ marginTop: insets.top + 16 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center justify-center"
          activeOpacity={0.7}
        >
          <DropIcon />
        </TouchableOpacity>

        {/* Page title */}
        <Text className="text-white text-2xl font-medium font-inter tracking-tight">
          Settings
        </Text>

        {/* Notification bell */}
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full border border-white"
          activeOpacity={0.7}
        >
          <Feather name="bell" size={24} color="#FAFAFA" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-5 px-5 pb-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <SectionCard>
          <Pressable
            className="flex-row items-center justify-between p-6"
            onPress={() => router.push("/(tabs)/my-profile" as any)}
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={require("@/assets/images/zuri.png")}
                className="w-10 h-10 rounded-full"
              />
              <View className="gap-1">
                <Text className="text-sm font-medium text-[#1E1E1E]">
                  Sarah Abraham
                </Text>
                <Text className="text-xs text-[#616161]">
                  sarahabraham@gmail.com
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color="#666666" />
          </Pressable>

          <View className="h-px bg-[#FFD6E8] mx-3" />

          <Pressable className="flex-row items-center justify-between px-3 py-6">
            <View className="flex-row items-center gap-1">
              <InviteIcon />
              <Text className="text-sm text-[#1E1E1E] leading-[21px]">
                Invite my partner/friend
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color="#666666" />
          </Pressable>
        </SectionCard>

        {/* Period Settings Card */}
        <SectionCard>
          <SettingRow
            icon={<PeriodIcon />}
            label="Period length"
            rightText="5 days"
            onPress={() => router.push("/(tabs)/period-length-settings" as any)}
          />
          <SettingRow
            icon={<CycleIcon />}
            label="Cycle length"
            rightText="28 days"
            onPress={() => router.push("/(tabs)/cycle-length-settings" as any)}
          />
          <SettingRow
            icon={<LutealIcon />}
            label="Luteal phase length"
            rightText="14 days"
            onPress={() => router.push("/(tabs)/luteal-phase-settings" as any)}
            isLast
          />
        </SectionCard>

        {/* Reminders Card */}
        <SectionCard>
          <SettingRow
            icon={<ReminderIcon />}
            label="Reminders"
            onPress={() => router.push("/(tabs)/reminders" as any)}
            isLast
          />
        </SectionCard>

        {/* Personalization Card */}
        <SectionCard>
          <SettingRow
            icon={<SymptomsIcon />}
            label="Symptoms"
            onPress={() => router.push("/add-log/symptoms")}
          />
          <SettingRow
            icon={<MoodsIcon />}
            label="Moods"
            onPress={() => router.push("/add-log/moods")}
          />
          <SettingRow
            iconName="eye"
            iconColor="#077845"
            label="Theme"
            onPress={() => setThemeModalVisible(true)}
          />
          <SettingRow
            icon={<LanguageIcon />}
            label="Language preferences"
            onPress={() => router.push("/(tabs)/language-settings" as any)}
            isLast
          />
        </SectionCard>

        {/* Wallet Card */}
        <SectionCard>
          <SettingRow
            icon={<WalletIcon />}
            label="Connect wallet"
            onPress={() => router.push("/(tabs)/connect-wallet" as any)}
            isLast
          />
        </SectionCard>

        {/* Support & Legal Card */}
        <SectionCard>
          <SettingRow iconName="help-circle" iconColor="#C62828" label="FAQ" />
          <SettingRow icon={<ContactSupportIcon />} label="Contact support" />
          <SettingRow icon={<PrivacyIcon />} label="Privacy policy" />
          <SettingRow
            icon={<RateAppIcon />}
            label="Rate app"
            onPress={() => setRateAppModalVisible(true)}
          />
          <SettingRow
            iconName="log-out"
            iconColor="#C62828"
            label="Log out"
            onPress={() => setLogoutModalVisible(true)}
            isLast
          />
        </SectionCard>

        {/* Delete Account */}
        <SectionCard>
          <Pressable className="flex-row items-center px-3 py-[14px] gap-1">
            <Feather name="trash-2" size={16} color="#FF0004" />
            <Text className="text-sm text-[#1E1E1E] leading-[21px]">
              Delete account
            </Text>
          </Pressable>
        </SectionCard>

        {/* Version */}
        <Text className="text-center text-xs text-white leading-[18px] mb-2">
          version 1.0.5
        </Text>
      </ScrollView>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Theme selection bottom sheet */}
      <Modal
        visible={themeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        {/* Dim overlay */}
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setThemeModalVisible(false)}
        />

        {/* Bottom sheet panel */}
        <View
          style={{
            backgroundColor: "#FFE6EE",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: insets.bottom || 20,
          }}
        >
          {/* Drag handle */}
          <View
            style={{
              width: 40,
              height: 5,
              backgroundColor: "#FF669A",
              borderRadius: 100,
              alignSelf: "center",
              marginTop: 12,
              marginBottom: 16,
            }}
          />

          {/* Title */}
          <Text
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: 20,
              color: "#000000",
              textAlign: "center",
              letterSpacing: -0.3,
              marginBottom: 16,
            }}
          >
            Select Theme
          </Text>

          {/* Divider below title */}
          <View style={{ height: 1, backgroundColor: "#FFB3CD" }} />

          {/* Options */}
          {THEME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedTheme(option.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 16,
                minHeight: 70,
              }}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "400",
                    fontSize: 16,
                    color: "#1E1E1E",
                  }}
                >
                  {option.label}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "400",
                    fontSize: 12,
                    color: "#333333",
                    opacity: 0.8,
                  }}
                >
                  {option.subtitle}
                </Text>
              </View>

              {selectedTheme === option.id && (
                <Feather name="check" size={18} color="#FF4081" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Rate App modal */}
      <Modal
        visible={rateAppModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRateAppModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          {/* Blur overlay */}
          <BlurView intensity={10} tint="dark" style={{ flex: 1 }}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setRateAppModalVisible(false)}
            />
          </BlurView>

          {/* Floating emoji circle + bottom sheet */}
          <View style={{ alignItems: "center" }}>
            {/* Emoji circle — overlaps the top of the sheet by 50px */}
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#FFE6EE",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: -50,
                zIndex: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 52 }}>😄</Text>
            </View>

            {/* Sheet */}
            <View
              style={{
                width: "100%",
                backgroundColor: "#FFE6EE",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingBottom: (insets.bottom || 0) + 32,
                alignItems: "center",
              }}
            >
              {/* Space for the 50px emoji overlap + breathing room */}
              <View style={{ height: 80 }} />

              {/* Drag handle */}
              {/* Title */}
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: 20,
                  color: "#000000",
                  letterSpacing: -0.3,
                  marginBottom: 16,
                }}
              >
                Rate App
              </Text>

              <View
                style={{ height: 1, backgroundColor: "#DBE2E8", width: "100%" }}
              />

              {/* Description */}
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: 16,
                  color: "#222222",
                  textAlign: "center",
                  marginTop: 28,
                  marginBottom: 28,
                  paddingHorizontal: 20,
                }}
              >
                Empower us by rating the app
              </Text>

              {/* Stars */}
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 36 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <StarIcon filled={star <= rating} size={40} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  paddingHorizontal: 20,
                  width: "100%",
                  marginBottom: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => setRateAppModalVisible(false)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    height: 56,
                    backgroundColor: "#FFF5F9",
                    borderRadius: 1000,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "500",
                      fontSize: 15,
                      color: "#FF4081",
                    }}
                  >
                    Later
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setRateAppModalVisible(false)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    height: 56,
                    backgroundColor: "#FF4081",
                    borderRadius: 1000,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "500",
                      fontSize: 15,
                      color: "#FFFFFF",
                    }}
                  >
                    Rate Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout confirmation modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          {/* Blur overlay */}
          <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setLogoutModalVisible(false)}
            />
          </BlurView>

          {/* Bottom sheet */}
          <View
            style={{
              backgroundColor: "#FFE6EE",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: (insets.bottom || 0) + 20,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                width: 40,
                height: 5,
                backgroundColor: "#FF669A",
                borderRadius: 100,
                alignSelf: "center",
                marginTop: 16,
                marginBottom: 24,
              }}
            />

            {/* Title */}
            <Text
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: 20,
                lineHeight: 24,
                letterSpacing: -0.3,
                color: "#000000",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Log Out
            </Text>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: "#FFB3CD" }} />

            {/* Confirmation text */}
            <Text
              style={{
                fontFamily: "Inter",
                fontWeight: "400",
                fontSize: 16,
                lineHeight: 19,
                color: "#222222",
                textAlign: "center",
                marginTop: 20,
                marginBottom: 50,
              }}
            >
              Are you sure you want to log out?
            </Text>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor: "#FFF5F9",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "500",
                    fontSize: 15,
                    color: "#FF4081",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLogoutModalVisible(false);
                  router.replace("/(auth)/login" as any);
                }}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor: "#FF4081",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "500",
                    fontSize: 15,
                    color: "#FFFFFF",
                  }}
                >
                  Yes, Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
