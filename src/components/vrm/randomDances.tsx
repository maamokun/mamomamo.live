"use client";
import { useState, useEffect, useRef, FC } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
// @ts-ignore
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationAction, Vector3 } from "three";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from "@pixiv/three-vrm-animation";
import { AnimationMixer, LoopOnce, LoopRepeat } from "three";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import Link from "next/link";

const animations = [
  {
    url: "https://cdn.mikn.dev/vroid/shikanoko.vrma",
    loop: true,
    percentage: 10,
  },
  {
    url: "https://cdn.mikn.dev/vroid/horahora.vrma",
    loop: true,
    percentage: 1.14514,
  },
  { url: "https://cdn.mikn.dev/vroid/hi.vrma", loop: false, percentage: 50 },
  {
    url: "https://cdn.mikn.dev/vroid/uishig.vrma",
    loop: false,
    percentage: 10,
  },
  {
    url: "https://cdn.mikn.dev/vroid/tetoris.vrma",
    loop: false,
    percentage: 10,
  },
  {
    url: "https://cdn.mikn.dev/vroid/telepathy.vrma",
    loop: false,
    percentage: 10,
  },
  {
    url: "https://cdn.mikn.dev/vroid/soware.vrma",
    loop: false,
    percentage: 10,
  },
];

export const VRMModel: FC<{
  vrm: import("@pixiv/three-vrm").VRM | null;
  mixer: AnimationMixer | null;
  action: AnimationAction | null;
  mousePosition: { x: number; y: number };
}> = ({ vrm, mixer, action, mousePosition }) => {
  useFrame((_state, delta) => {
    if (vrm) {
      vrm.scene.position.set(0, -4.2, 0);
      vrm.scene.scale.set(6.5, 5, 5);
      vrm.scene.rotation.y = Math.PI;
      vrm.expressionManager?.setValue("neutral", 1);

      const isAnimationFinished = action && !action.isRunning();

      if (isAnimationFinished && vrm.lookAt) {
        const targetX = mousePosition.x * 3;
        const targetY = mousePosition.y * 3;
        const targetZ = 5;
        const lookAtTarget = new Vector3(targetX, targetY, targetZ);
        vrm.lookAt.lookAt(lookAtTarget);
      }

      vrm.update(delta);
    }
    if (mixer) {
      mixer.update(delta);
    }
  });

  return vrm ? <primitive object={vrm.scene} /> : null;
};

export function VRM() {
  const [vrm, setVrm] = useState<import("@pixiv/three-vrm").VRM | null>(null);
  const [mixer, setMixer] = useState<AnimationMixer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const actionRef = useRef<AnimationAction | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser: any) => new VRMLoaderPlugin(parser));
    loader.register((parser: any) => new VRMAnimationLoaderPlugin(parser));

    const loadModel = () => {
      return new Promise<import("@pixiv/three-vrm").VRM>((resolve, reject) => {
        loader.load(
          "https://cdn.mikn.dev/vroid/mikan.dev(kyonyu).vrm",
          (gltf: GLTF) => {
            const loadedVrm = gltf.userData.vrm;
            setVrm(loadedVrm);
            resolve(loadedVrm);
          },
          undefined,
          (error: Error) => {
            console.error("An error occurred while loading the model:", error);
            reject(error);
          },
        );
      });
    };

    function pickAnimation() {
      const total = animations.reduce((sum, anim) => sum + anim.percentage, 0);
      const rand = Math.random() * total;
      let acc = 0;
      for (const anim of animations) {
        acc += anim.percentage;
        if (rand < acc) return anim;
      }
      return animations[0];
    }

    const loadAnimation = (loadedVrm: import("@pixiv/three-vrm").VRM) => {
      const { url, loop } = pickAnimation();

      loader.load(
        url,
        (gltf: GLTF) => {
          const vrmAnimations = gltf.userData.vrmAnimations;
          if (vrmAnimations && vrmAnimations.length > 0) {
            if (loadedVrm && loadedVrm.humanoid) {
              const animationClip = createVRMAnimationClip(vrmAnimations[0], loadedVrm);
              const animationMixer = new AnimationMixer(loadedVrm.scene);
              const action = animationMixer.clipAction(animationClip);

              if (loop) {
                action.setLoop(LoopRepeat, Infinity);
              } else {
                action.setLoop(LoopOnce, 1);
                action.clampWhenFinished = true;
              }

              action.play();
              setMixer(animationMixer);
              actionRef.current = action;
            } else {
              console.error("VRM model or humanoid is not loaded correctly.");
            }
          }
        },
        undefined,
        (error: Error) => {
          console.error("An error occurred while loading the animation:", error);
        },
      );
    };

    loadModel()
      .then((loadedVrm) => {
        setIsLoaded(true);
        loadAnimation(loadedVrm);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="rounded-full overflow-hidden size-70">
      <div className="flex flex-col justify-center items-center w-full h-full">
        {!isLoaded ? (
          <div className="flex items-center justify-center">
            <Spinner className={"text-primary size-12"} />
          </div>
        ) : (
          <Link href={"/playground"} className={"block w-full h-full"}>
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={1} />
              <VRMModel
                vrm={vrm}
                mixer={mixer}
                action={actionRef.current}
                mousePosition={mousePosition}
              />
            </Canvas>
          </Link>
        )}
      </div>
    </div>
  );
}
