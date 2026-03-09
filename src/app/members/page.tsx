import InfiniteMenu from "@/components/InfiniteMenu";

import mamomamo from "@/assets/mamomamoStare.png";
import mgnm from "@/assets/mgnmRecommend.png";

const items = [
  {
    image: mamomamo.src,
    link: "/members/mamomamo",
    title: "まもまも",
    description: "主すわぁん！",
  },
  {
    image: mgnm.src,
    link: "/members/mgnm",
    title: "まぐなむ",
    description: "淫夢厨です",
  },
];

export default function Members() {
  return (
    <div className={"flex items-center justify-center w-full h-screen"}>
      <InfiniteMenu items={items} scale={1} />
    </div>
  );
}
