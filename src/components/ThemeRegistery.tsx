"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

// Create a context for theme mode
export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'dark'
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#f4f4f4' : '#333333',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: ["IRANSansX", "serif"].join(","),
          fontSize: 12,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// Custom hook to use the theme mode
export const useColorMode = () => useContext(ColorModeContext);
