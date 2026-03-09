"use client";
import * as Swetrix from "swetrix";
import { ReactNode } from "react";
import { Footer } from "@/components/mikn/Footer";
import { Header } from "@/components/mikn/Header";
import { SiYoutube } from "@icons-pack/react-simple-icons";
import CustomCursor from "@/components/mikanCursor";
import Logo from "@/assets/mamomamoLogo.png";

export default function PagesLayout({ children }: { children: ReactNode }) {
  Swetrix.init("1rtCvreKr4w8", {
    apiURL: "https://analytics.mikandev.com/backend/v1/log",
  });

  Swetrix.trackViews();

  const social = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@maamokun",
      color: "hover:text-youtube hover:bg-youtube",
      icon: SiYoutube,
    },
  ];

  const links = [
    {
      name: "団体概要",
      children: [
        {
          name: "ホームページ",
          href: "https://mikn.dev/",
        },
      ],
    },
  ];

  const navigation = [
    { name: "プロフィール", href: "/profile" },
    { name: "メンバー紹介", href: "/members" },
  ];

  return (
    <>
      <CustomCursor />
      <Header
        brand={{
          name: "mamomamo",
          href: "/",
          logo: Logo.src,
          showTitle: false,
        }}
        navigation={navigation}
        color={"#FF7700"}
      />
      <div className={"min-h-screen"}>{children}</div>
      <Footer
        social={social}
        links={links}
        copyright={`2020-${new Date().getFullYear()} MikanDev`}
        className="text-white font-bold bg-secondary"
      >
        <div className="flex items-center self-end"></div>
      </Footer>
    </>
  );
}
