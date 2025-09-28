export const Colors = {
  primary: '#800000',      // Maroon
  primaryLight: '#a52a2a', // Light maroon
  primaryDark: '#4d0000',  // Dark maroon

  secondary: '#f8f4f4',    // Light maroon tinted gray
  secondaryDark: '#e8d8d8', // Slightly darker maroon tinted gray

  background: '#ffffff',    // White
  surface: '#fdfcfc',      // Off-white with subtle maroon tint

  text: {
    primary: '#2a1111',    // Dark maroon tinted text
    secondary: '#754545',  // Maroon tinted medium gray
    light: '#bd9999',     // Maroon tinted light gray
    white: '#ffffff',     // White
  },

  accent: '#d45087',       // Maroon-pink for highlights
  success: '#4caf50',      // Green
  warning: '#ff9800',      // Orange
  error: '#c44569',        // Maroon-red

  border: '#e0d0d0',       // Light maroon tinted border
  shadow: '#80000020',     // Semi-transparent maroon
};

export const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  shadows: {
    sm: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    md: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};