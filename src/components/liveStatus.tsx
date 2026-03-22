"use client";
import { ChannelVideo } from "@/lib/latest-live";
import { YouTubeEmbed } from "@next/third-parties/google";
import Image from "next/image";
import useSWR from "swr";

import mikan from "@/assets/mikan.png";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LiveStatus() {
  const { data, error, isLoading } = useSWR<ChannelVideo>("/latest/json", fetcher, {
    refreshInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className={"flex flex-col items-center justify-center gap-4 w-full max-w-3xl px-4"}>
        <div className={"flex flex-row items-center justify-center gap-2"}>
          <Image
            src={mikan}
            alt={"Mikan"}
            width={50}
            height={50}
            className={"animate-spin size-10"}
          />
          <h2 className={"text-2xl"}>読み込み中...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={"flex flex-col items-center justify-center gap-4 w-full max-w-3xl px-4"}>
        <h2 className={"text-2xl"}>配信情報を取得できませんでした</h2>
      </div>
    );
  }

  if (data.isLive) {
    return (
      <div className={"flex flex-col items-center justify-center gap-4 w-full max-w-3xl px-4"}>
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
        <div className={"w-full aspect-video"}>
          <YouTubeEmbed videoid={data.id} />
        </div>
      </div>
    );
  } else {
    return (
      <div className={"flex flex-col items-center justify-center gap-4 w-full max-w-3xl px-4"}>
        <h2 className={"text-2xl"}>直近の配信はこれだよー</h2>
        <div className={"w-full aspect-video"}>
          <YouTubeEmbed videoid={data.id} />
        </div>
      </div>
    );
  }
}
