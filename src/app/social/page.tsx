import type { Metadata } from "next";
import { SocialClient } from "./social-client";

export const metadata: Metadata = {
  title: "Social & Contact — RIKO",
  description:
    "Stay connected with RIKO. Watch our culinary reels, find our contact information, location, and social channels.",
};

export default function SocialPage() {
  return <SocialClient />;
}
