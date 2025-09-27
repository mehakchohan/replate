export const Colors = {
  primary: '#800000',      // Maroon
  primaryLight: '#a52a2a', // Light maroon
  primaryDark: '#4d0000',  // Dark maroon

  secondary: '#f5f5f5',    // Light gray
  secondaryDark: '#e8e8e8', // Slightly darker gray

  background: '#ffffff',    // White
  surface: '#fafafa',      // Off-white

  text: {
    primary: '#212121',    // Dark gray
    secondary: '#757575',  // Medium gray
    light: '#bdbdbd',     // Light gray
    white: '#ffffff',     // White
  },

  accent: '#ff6b6b',       // Coral red for highlights
  success: '#4caf50',      // Green
  warning: '#ff9800',      // Orange
  error: '#f44336',        // Red

  border: '#e0e0e0',       // Light border
  shadow: '#00000020',     // Semi-transparent black
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