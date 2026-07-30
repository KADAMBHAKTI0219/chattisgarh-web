"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// CrowdCanvas component utilizing optimized canvas rendering for black & white Szenia sprites
export function CrowdCanvas({ src, rows = 15, cols = 7 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min, max) => min + Math.random() * (max - min);
    const randomIndex = (array) => randomRange(0, array.length) | 0;
    const removeFromArray = (array, i) => array.splice(i, 1)[0];
    const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;

      // Limit vertical offset to keep them walking nicely on the ground baseline
      const offsetY = randomRange(-20, 20);
      const startY = stage.height - peep.height + offsetY;
      let startX;
      let endX;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }) => {
      const { startX, startY, endX } = props;
      const xDuration = 12; // Slower, more natural walking speed
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.2));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 8,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    const clothingColors = [
      { r: 247, g: 152, b: 180 }, // Soft Pink
      { r: 238, g: 93, b: 140 }, // Bright Pink
      { r: 248, g: 124, b: 34 }, // Vibrant Orange
      { r: 69, g: 133, b: 246 }, // Electric Blue
      { r: 0, g: 163, b: 163 }, // Teal
      { r: 190, g: 32, b: 121 }, // Magenta
      { r: 156, g: 39, b: 176 }, // Purple
      { r: 16, g: 185, b: 129 }, // Emerald
      { r: 245, g: 158, b: 11 }, // Amber Gold
      { r: 225, g: 29, b: 72 }, // Crimson Red
      { r: 139, g: 92, b: 246 }, // Violet
      { r: 6, g: 182, b: 212 }  // Cyan
    ];

    // FACTORY FUNCTIONS
    const createPeep = ({ image, rect }) => {
      const peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        offscreenCanvas: null,
        setRect: (rect) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];

          // Create offscreen canvas to pre-render the original peep frame
          const off = document.createElement("canvas");
          off.width = peep.width;
          off.height = peep.height;
          const oCtx = off.getContext("2d");

          if (oCtx) {
            oCtx.drawImage(
              peep.image,
              rect[0],
              rect[1],
              rect[2],
              rect[3],
              0,
              0,
              peep.width,
              peep.height
            );

            // Colorize clothing (from 32% down to 96% height) while leaving face & skin tone natural
            try {
              const imgData = oCtx.getImageData(0, 0, peep.width, peep.height);
              const data = imgData.data;
              const color = getRandomFromArray(clothingColors);
              const startY = Math.floor(peep.height * 0.32);
              const endY = Math.floor(peep.height * 0.96);

              for (let y = startY; y < endY; y++) {
                for (let x = 0; x < peep.width; x++) {
                  const idx = (y * peep.width + x) * 4;
                  const r = data[idx];
                  const g = data[idx + 1];
                  const b = data[idx + 2];
                  const a = data[idx + 3];

                  // Fill white/light clothing area with vibrant color, keeping crisp black outlines
                  if (a > 50 && r > 180 && g > 180 && b > 180) {
                    data[idx] = color.r;
                    data[idx + 1] = color.g;
                    data[idx + 2] = color.b;
                  }
                }
              }
              oCtx.putImageData(imgData, 0, 0);
            } catch (e) {
              // fallback if canvas security prevents getImageData
            }
          }
          peep.offscreenCanvas = off;
        },
        render: (ctx) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          if (peep.offscreenCanvas) {
            ctx.drawImage(peep.offscreenCanvas, 0, 0);
          }
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps = [];
    const availablePeeps = [];
    const crowd = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      stage.width = rect.width;
      stage.height = rect.height;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = stage.width * ratio;
      canvas.height = stage.height * ratio;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas ref={canvasRef} className="absolute bottom-0 w-full h-full bg-transparent" />
  );
}

export default function CrowdSection() {
  return (
    <section className="relative w-full h-[450px]  bg-[#FAF7F0] mt-16 md:mt-24 mb-0 overflow-visible z-10 flex items-end">

      {/* Title stacked with vertical line matching user image mockup */}
      <div className="absolute inset-x-0 top-0 flex flex-col justify-start items-center pt-4 text-center select-none pointer-events-none">
        <span className="font-sans font-black text-xs xl:text-sm uppercase tracking-[0.25em] text-zinc-400 leading-tight">
          Crowd
        </span>
        <span className="font-sans font-black text-xs xl:text-sm uppercase tracking-[0.25em] text-zinc-400 leading-tight mt-1">
          Canvas
        </span>
        {/* Thin vertical connector line scales up on large viewports */}
        <div className="h-20 xl:h-28 2xl:h-36 w-[1.5px] bg-zinc-300 mt-2"></div>
      </div>

      {/* Walking crowd canvas */}
      <div className="absolute bottom-0 left-0 right-0 h-full w-full overflow-visible">
        <CrowdCanvas
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png"
          rows={15}
          cols={7}
        />
      </div>

    </section>
  );
}
