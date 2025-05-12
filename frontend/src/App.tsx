import React, { useState, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { blue, red, orange, green } from "@mui/material/colors";
import { Search } from "./components/Search/Search";

// Map of theme names to MUI color values
const COLOR_MAP = {
  Blue: blue[700],
  Red: red[700],
  Orange: orange[700],
  Green: green[700],
} as const;
type ColorKey = keyof typeof COLOR_MAP;

// Function to run React App
function App() {
  const [mode, setMode] = useState<"light" | "dark">("light"); // toggles between light & dark mode
  const [color, setColor] = useState<ColorKey>("Blue"); // selects primary palette color for theme
  const [anchorElement, setanchorElement] = useState<HTMLElement | null>(null); // holds element that opened settings menu

  // Function to change theme color only when theme changed
  const theme = useMemo(
    () =>
      // Create new theme
      createTheme({
        palette: {
          mode,
          primary: { main: COLOR_MAP[color] },
          background: {
            default: mode === "light" ? "#fafafa" : "#121212",
          },
        },
        // Force theme color onto top NavBar
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
              }),
            },
          },
          // Force hover color to be more visible & selected to be theme color
          MuiMenuItem: {
            styleOverrides: {
              root: ({ theme }) => ({
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.15),
                },
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }),
            },
          },
        },
      }),
    [mode, color]
  );

  // Handle opening & closing the settings menu
  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setanchorElement(e.currentTarget);
  const closeMenu = () => setanchorElement(null);

  return (
    <ThemeProvider theme={theme}>
      {/* Apply MUI global reset & background */}
      <CssBaseline />

      {/* Top AppBar with Settings */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            YouTube Offline
          </Typography>
          <IconButton color="inherit" onClick={openMenu}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Dropdown Settings Menu */}
      <Menu anchorEl={anchorElement} open={!!anchorElement} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            setMode((m) => (m === "light" ? "dark" : "light"));
            closeMenu();
          }}
        >
          <ListItemIcon>
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </ListItemIcon>
          <ListItemText>
            {mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </ListItemText>
        </MenuItem>

        {/* Theme color options */}
        {(Object.keys(COLOR_MAP) as ColorKey[]).map((col) => (
          <MenuItem
            key={col}
            selected={col === color}
            onClick={() => {
              setColor(col);
              closeMenu();
            }}
          >
            <ListItemText>{col} Theme</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pt: 4,
          pb: 4,
        }}
      >
        {/* Inner Search component container */}
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Search />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
