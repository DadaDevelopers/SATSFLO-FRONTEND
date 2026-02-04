import { useWindowDimensions, ViewStyle, Platform } from 'react-native';

const MAX_CONTENT_WIDTH = 480;
const MAX_CONTENT_HEIGHT = 844; // iPhone 14 Pro height

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isDesktop = width > MAX_CONTENT_WIDTH;
  const isWeb = Platform.OS === 'web';

  // Container style for the inner content wrapper (the "phone" frame)
  const containerStyle: ViewStyle = isDesktop ? {
    maxWidth: MAX_CONTENT_WIDTH,
    maxHeight: MAX_CONTENT_HEIGHT,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FF4081',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 24,
    overflow: 'hidden',
  } : {};

  // Outer wrapper style (the gray background area)
  const outerStyle: ViewStyle = {
    backgroundColor: isDesktop ? '#f5f5f5' : '#FF4081',
    paddingTop: isDesktop ? 20 : 0,
    paddingBottom: isDesktop ? 20 : 0,
    minHeight: isWeb ? '100vh' : undefined,
  } as ViewStyle;

  const outerBackgroundColor = isDesktop ? '#f5f5f5' : '#FF4081';

  return {
    width,
    height,
    isDesktop,
    isMobile: !isDesktop,
    isWeb,
    maxContentWidth: MAX_CONTENT_WIDTH,
    maxContentHeight: MAX_CONTENT_HEIGHT,
    containerStyle,
    outerStyle,
    outerBackgroundColor,
  };
}
