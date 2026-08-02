"use client";

import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import OurStory from "@/components/OurStory/OurStory";
import Venue from "@/components/Venue/Venue";
import Countdown from "@/components/Countdown/Countdown";
import GiftList from "@/components/GiftList/GiftList";
import RSVP from "@/components/RSVP/RSVP";
import Footer from "@/components/Footer/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Home() {
  useScrollAnimation();

  return (
    <>
      <Navbar />
      <Hero />
      <OurStory />
      <Venue />
      <Countdown />
      <GiftList />
      <RSVP />
      <Footer />
    </>
  );
}
