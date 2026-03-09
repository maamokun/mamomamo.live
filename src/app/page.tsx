import AnimatedIntro from "@/components/animatedIntro";
import { latestLive } from "@/lib/latest-live";
import { TPoseRotate } from "@/components/vrm/tposeRotate";
import LiveStatus from "@/components/liveStatus";
import { Button } from "@/components/animate-ui/components/buttons/button";

export default async function Home() {
  const latest = await latestLive("@maamokun");
  return (
    <>
      <AnimatedIntro />
      <div className={"flex flex-col md:flex-row items-center justify-center gap-8 min-h-svh px-8"}>
        <div className={"flex items-center justify-center"}>
          <TPoseRotate />
        </div>
        <div className={"flex flex-col items-center justify-center"}>
          <LiveStatus video={latest} />
          <div className={"flex flex-row items-center justify-center gap-4 mt-4"}>
            <a href={"/latest"} target={"_blank"} rel={"noopener noreferrer"}>
              <Button>直近の配信を見に行く</Button>
            </a>
            <a
              href={"https://youtube.com/@maamokun"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              <Button>チャンネルへ</Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
