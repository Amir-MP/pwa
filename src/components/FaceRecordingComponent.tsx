'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

export default function FaceRecordingComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);

  useEffect(() => {
    loadModels();
    startVideo(); // Start video stream when component mounts
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setIsModelLoaded(true);
      console.log('Models loaded successfully');
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // Ensure video starts playing
        setIsStreamReady(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detectFaces = async () => {
      if (!isRecording) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceLandmarks(canvas, detections);
      }

      if (isRecording) {
        requestAnimationFrame(detectFaces);
      }
    };

    detectFaces();
  };

  const startRecording = async () => {
    if (!videoRef.current || !isModelLoaded || !isStreamReady) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (!stream) {
      console.error("No media stream available");
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `face-recording-${new Date().toISOString()}.webm`;
        a.click();
        setIsRecording(false);
        setTimeLeft(30);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setTimeLeft(30);

      // Start face detection
      detectFace();

      // Stop recording after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 30000);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  // Update timer
  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording, timeLeft]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl mb-4">ضبط تصویر</h1>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-[640px] h-[480px] bg-gray-200"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-[640px] h-[480px]"
        />
        {/* Face guide overlay */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[400px] border-4 border-blue-400 rounded-full opacity-50 flex items-center justify-center">
            <div className="text-blue-600 text-sm bg-white/80 px-2 py-1 rounded">
              صورت خود را در این قسمت قرار دهید
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={!isModelLoaded || !isStreamReady}
            className={`px-4 py-2 rounded ${
              isModelLoaded && isStreamReady
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!isModelLoaded 
              ? 'درحال بارگذاری مدل...' 
              : !isStreamReady 
                ? 'درحال راه اندازی دوربین...'
                : 'ضبط شروع شد'}
          </button>
        ) : (
          <div className="text-xl font-semibold text-blue-600">
            درحال ضبط: {timeLeft}ثانیه باقی مانده
          </div>
        )}
      </div>
    </div>
  );
}