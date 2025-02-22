"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import {
  QrCode as QrCodeIcon,
  Fingerprint as FingerprintIcon,
  Draw as SignatureIcon,
  LocalHospital as MedicalIcon,
  RequestPage as RequestIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Home,
  Message as MessageIcon,
} from "@mui/icons-material";
import ThemeToggle from "./ThemeToggle";

// Navigation configuration
const NAVIGATION_ITEMS = {
  footer: [
    { name: "خانه", icon: <Home />, href: "/home" },
    { name: "درخواست ها", icon: <RequestIcon />, href: "/requests" },
    { name: "خدمات", icon: <MedicalIcon />, href: "/services" },
    { name: "کارت ها", icon: <CarIcon />, href: "/cards" },
    { name: "پروفایل", icon: <PersonIcon />, href: "/profile" },
  ],
  mainMenu: [
    { name: "اسکن QR", icon: <QrCodeIcon />, href: "/qr-code" },
    { name: "اثر انگشت", icon: <FingerprintIcon />, href: "/finger-print" },
    { name: "امضا", icon: <SignatureIcon />, href: "/signature" },
    { name: "ارسال پیامک", icon: <MessageIcon />, href: "/send-sms" },
    { name: "سایر خدمات", icon: <MedicalIcon />, href: "/notifications" },
  ],
  quickAccess: [
    { name: "درخواست ها", icon: <RequestIcon />, href: "/requests" },
    { name: "پروفایل", icon: <PersonIcon />, href: "/profile" },
  ],
};

// Navigation Card Component
const NavigationCard = ({ item, fullWidth = false }) => (
  <Box
    component={Link}
    href={item.href}
    sx={{
      textDecoration: "none",
      width: fullWidth ? "100%" : "auto",
      display: "block",
    }}
  >
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
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
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
          "&:last-child": { pb: 2 },
        }}
      >
        <Box sx={{ mb: 1, opacity: 0.9 }}>{item.icon}</Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {item.name}
        </Typography>
      </CardContent>
    </Card>
  </Box>
);

// Bottom Navigation Component
const BottomNav = () => {
  const pathname = usePathname();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
        bgcolor: "background.paper",
      }}
      elevation={3}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: 56,
          "@supports (padding: env(safe-area-inset-bottom))": {
            paddingBottom: "env(safe-area-inset-bottom)",
          },
        }}
      >
        {NAVIGATION_ITEMS.footer.map((item) => (
          <Box
            key={item.name}
            component={Link}
            href={item.href}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center", // Added this
              color: pathname === item.href ? "primary.main" : "text.secondary",
              textDecoration: "none",
              flex: 1,
              height: "100%", // Added this
            }}
          >
            {item.icon}
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const HomePage = () => {
  const sendTextMessage = (phoneNumber?: string, message?: string) => {
    try {
      let smsUrl = 'sms:';
      
      if (phoneNumber) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        smsUrl += isIOS ? `${phoneNumber}&` : `${phoneNumber}?`;
      }
      
      if (message) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        smsUrl += isIOS ? `body=${encodeURIComponent(message)}` : `sms=${encodeURIComponent(message)}`;
      }

      // Check if running in a PWA environment
      if (window.matchMedia('(display-mode: standalone)').matches) {
        window.location.href = smsUrl;
      } else {
        // If not in PWA, open in new tab
        window.open(smsUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening messaging app:', error);
      alert('خطا در باز کردن برنامه پیام رسان. لطفا دوباره تلاش کنید.');
    }
  };

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
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ pt: 9, pb: 8 }}>
        {/* Wallet Card */}
        <Card
          sx={{
            mb: 1,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 40%)",
            },
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
                fontFamily: "monospace",
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

        {/* Quick Access Grid */}
        <Grid container spacing={1} pb={1}>
          {NAVIGATION_ITEMS.quickAccess.map((item) => (
            <Grid item xs={6} sm={6} md={6} key={item.name}>
              <NavigationCard item={item} fullWidth />
            </Grid>
          ))}
        </Grid>

        {/* Main Menu Grid */}
        <Grid container spacing={1} mb={4} justifyContent="center">
          {NAVIGATION_ITEMS.mainMenu.map((item) => (
            <Grid item xs={4} sm={4} md={3} key={item.name}>
              <NavigationCard item={item} />
            </Grid>
          ))}
        </Grid>

 
      </Container>

      {/* Bottom Navigation */}
      <BottomNav />
    </Box>
  );
};

export default HomePage;
