declare module '@expo-google-fonts/inter' {
  export const Inter_400Regular: number;
  export const Inter_500Medium: number;
  export const Inter_600SemiBold: number;
  export const Inter_700Bold: number;
  export function useFonts(fonts: { [key: string]: number }): [boolean, Error | null];
}

declare module '@expo-google-fonts/poppins' {
  export const Poppins_400Regular: number;
  export const Poppins_500Medium: number;
  export const Poppins_600SemiBold: number;
  export const Poppins_700Bold: number;
  export function useFonts(fonts: { [key: string]: number }): [boolean, Error | null];
}
