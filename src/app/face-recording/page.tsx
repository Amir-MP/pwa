"use client";

import dynamic from "next/dynamic";

const FaceRecordingComponent = dynamic(
  () => import("../../components/FaceRecordingComponent"),
  { ssr: false }
);

export default function FaceRecording() {
  return <FaceRecordingComponent />;
}
