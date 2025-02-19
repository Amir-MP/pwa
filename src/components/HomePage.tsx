"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  IconButton,
  Drawer,
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  QrCode as QrCodeIcon,
  Fingerprint as FingerprintIcon,
  Draw as SignatureIcon,
  LocalHospital as MedicalIcon,
  RequestPage as RequestIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Receipt as BillIcon,
  Wifi as InternetIcon,
  Payment as ChargeIcon,
  LocalHospital,
  Home,
} from "@mui/icons-material";
// Add these to your existing imports
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  // ... your other icons
} from "@mui/icons-material";
import ThemeToggle from "./ThemeToggle";
export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const footerNavItems = [
    { name: "خانه", icon: <Home />, href: "/" },
    { name: "درخواست ها", icon: <RequestIcon />, href: "/requests" },
    { name: "خدمات", icon: <MedicalIcon />, href: "/services" },
    { name: "کارت ها", icon: <CarIcon />, href: "/cards" },
    { name: "پروفایل", icon: <PersonIcon />, href: "/profile" },
  ];

  const menuItems = [
    { name: "اسکن QR", icon: <MedicalIcon />, href: "/qr-code" },
    { name: "اثر انگشت", icon: <RequestIcon />, href: "/finger-print" },
    { name: "امضا", icon: <CarIcon />, href: "/signature" },
    {
      name: "تصویر برداری",
      icon: <PersonIcon />,
      href: "/scan-image",
    },
    {
      name: "قبوض",
      icon: <PersonIcon />,
      href: "/scan-image",
    },
    {
      name: "سایر خدمات",
      icon: <PersonIcon />,
      href: "/scan-image",
    },
  ];

  const menuItems2 = [
    { name: "درخواست ها", icon: <MedicalIcon />, href: "/qr-code" },
    {
      name: "پروفایل",
      icon: <PersonIcon />,
      href: "/scan-image",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{ bgcolor: "background.paper", backdropFilter: "blur(20px)" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            دایــا اپـــــــــ
          </Typography>
          <ThemeToggle />

          {/*       <IconButton
            color="inherit"
            sx={{ display: { sm: "none" } }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton> */}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          {menuItems.map((item) => (
            <Card
              key={item.name}
              sx={{
                m: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => {
                window.location.href = item.href;
                setIsMenuOpen(false);
              }}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {item.icon}
                <Typography>{item.name}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container sx={{ pt: 9, pb: 4 }}>
        {/* Wallet Card */}
        <Card
          sx={{
            mb: 1,
            position: "relative",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "0.9rem", opacity: 0.9 }}
              >
                کیف پول کاور
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: "bold",
                textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              2,500,000 تومان
            </Typography>
            <Typography
              variant="h5"
              sx={{
                letterSpacing: 4,
                opacity: 0.9,
                textAlign: "center",
                textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              5282 3456 7890 1289
            </Typography>
          </CardContent>
        </Card>
        <Grid item xs={6} sm={6} md={6} mb={1}>
          <img src="images/output-onlinepngtools.png" alt="" width={"100%"} />
        </Grid>
        <Grid container spacing={1} pb={1}>
          {menuItems2.map((item) => (
            <Grid item xs={6} sm={6} md={6} key={item.name}>
              <Card
                sx={{
                  cursor: "pointer",
                 
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  height: "100%",
                  display: "flex", // Add flex display
                  alignItems: "center", // Center content vertically
                  justifyContent: "center", // Center content horizontally
                }}
                onClick={() => (window.location.href = item.href)}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    p: 2,
                    px: 1, // Reduce horizontal padding
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:last-child": {
                      // Override MUI's default padding bottom
                      pb: 2,
                    },
                  }}
                >
                  <Box sx={{ mb: 1 }}>{item.icon}</Box>
                  <Typography variant="body2">{item.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Menu Grid */}
        <Grid
          container
          spacing={1}
          mb={4}
          justifyContent="center" // Center the grid items horizontally
        >
          {menuItems.map((item) => (
            <Grid item xs={4} sm={4} md={3} key={item.name}>
              <Card
                sx={{
                  cursor: "pointer",
                 
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
                onClick={() => (window.location.href = item.href)}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    p: 2,
                    px: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:last-child": {
                      pb: 2,
                    },
                  }}
                >
                  <Box sx={{ mb: 1, opacity: 0.9 }}>{item.icon}</Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {item.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderRadius: 0,
          bgcolor: "background.paper",
          // Add these new styles
          height: "auto",
          maxHeight: "56px", // Standard height for bottom navigation
          transform: "translateZ(0)", // Forces hardware acceleration
          willChange: "transform", // Optimizes animations
          "@supports (padding: env(safe-area-inset-bottom))": {
            paddingBottom: "env(safe-area-inset-bottom)", // Handles iPhone notch
          },
        }}
        elevation={3}
      >
        <BottomNavigation
          sx={{
            width: "100%",
            height: "100%", // Ensure full height
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
              padding: "6px 0",
              minHeight: "56px", // Consistent height
            },
          }}
          showLabels
        >
          {footerNavItems.map((item) => (
            <BottomNavigationAction
              key={item.name}
              label={item.name}
              icon={item.icon}
              onClick={() => (window.location.href = item.href)}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
