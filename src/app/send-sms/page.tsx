"use client";
import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material";

const SendSMSPage = () => {
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
    <Container sx={{ pt: 2, pb: 8 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        ارسال پیامک
      </Typography>

      <Card sx={{ 
        mb: 2,
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
      }}>
        <CardContent>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            برای تست ارسال پیامک، یکی از گزینه‌های زیر را انتخاب کنید
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <button
                onClick={() => sendTextMessage('09123456789', 'سلام از اپلیکیشن دایا')}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                }}
              >
                ارسال به اندروید
              </button>
            </Grid>
            <Grid item xs={12} md={6}>
              <button
                onClick={() => sendTextMessage('+989123456789', 'سلام از اپلیکیشن دایا')}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                }}
              >
                ارسال به آیفون
              </button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              توجه: برای ارسال پیامک، برنامه پیام‌رسان پیش‌فرض دستگاه شما باز خواهد شد.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SendSMSPage; 