"use client";
import { ChannelVideo } from "@/lib/latest-live";
import { YouTubeEmbed } from "@next/third-parties/google";
import Image from "next/image";

import mikan from "@/assets/mikan.png";

export default function LiveStatus({ video }: { video: ChannelVideo }) {
  if (video.isLive) {
    return (
      <div className={"flex flex-col items-center justify-center gap-4 w-180"}>
        <div className={"flex flex-row items-center justify-center gap-2"}>
          <Image
            src={mikan}
            alt={"Mikan"}
            width={50}
            height={50}
            className={"animate-spin size-10"}
          />
          <h2 className={"text-2xl"}>配信中だよー！</h2>
        </div>
        <YouTubeEmbed videoid={video.id} width={720} />
      </div>
    );
  } else {
    return (
      <div className={"flex flex-col items-center justify-center gap-4 w-180"}>
        <h2 className={"text-2xl"}>直近の配信はこれだよー</h2>
        <YouTubeEmbed videoid={video.id} width={720} />
      </div>
    );
  }
}
