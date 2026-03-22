import AnimatedIntro from "@/components/animatedIntro";
import { TPoseRotate } from "@/components/vrm/tposeRotate";
import LiveStatus from "@/components/liveStatus";
import { Button } from "@/components/animate-ui/components/buttons/button";
import CurvedLoop from "@/components/curvedLoop";

export default function Home() {
  return (
    <>
      <AnimatedIntro />
      <div className={"flex flex-col md:flex-row items-center justify-center gap-8 min-h-svh px-8"}>
        <div className={"flex items-center justify-center"}>
          <TPoseRotate />
        </div>
        <div className={"flex flex-col items-center justify-center"}>
          <LiveStatus />
          <div className={"flex flex-row items-center justify-center gap-4 mt-4"}>
            <a href={"/latest"} target={"_blank"} rel={"noopener noreferrer"}>
              <Button>直近の配信を見に行く</Button>
            </a>
            <a href={"https://youtube.com/@maamokun"} target={"_blank"} rel={"noopener noreferrer"}>
              <Button>チャンネルへ</Button>
            </a>
          </div>
        </div>
      </div>
      <CurvedLoop
        marqueeText={"まもまも！"}
        speed={3}
        curveAmount={180}
        direction="right"
        interactive={true}
        className=""
      />
    </>
  );
}
