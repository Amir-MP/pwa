"use client";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { useState } from "react";

const SendSMSPage = () => {
  const [message, setMessage] = useState("");

  const sendTextMessage = async () => {
    try {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      let smsUrl = isIOS
        ? `sms:&body=${encodeURIComponent(message)}`
        : `sms:?body=${encodeURIComponent(message)}`;

      window.location.href = smsUrl;

      setTimeout(async () => {
        try {
          if (navigator.share) {
            await navigator.share({
              text: message,
            });
          }
        } catch (shareError) {
          console.error("Share failed:", shareError);
        }
      }, 500);
    } catch (error) {
      console.error("Error opening messaging app:", error);
      alert("خطا در باز کردن برنامه پیام رسان. لطفا دوباره تلاش کنید.");
    }
  };

  return (
    <Container sx={{ pt: 2, pb: 8 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        ارسال پیامک
      </Typography>

      <Card
        sx={{
          mb: 2,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            متن پیام خود را وارد کنید
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="پیام خود را اینجا بنویسید..."
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
                borderRadius: 2,
              },
            }}
          />

          <button
            onClick={sendTextMessage}
            disabled={!message.trim()}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: message.trim() ? "#2196f3" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: message.trim() ? "pointer" : "not-allowed",
              marginBottom: "10px",
            }}
          >
            ادامه و انتخاب مخاطب
          </button>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              توجه: پس از کلیک روی دکمه، برنامه پیام‌رسان باز خواهد شد و
              می‌توانید مخاطب مورد نظر را انتخاب کنید.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SendSMSPage;
