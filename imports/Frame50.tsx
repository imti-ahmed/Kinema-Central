import svgPaths from "./svg-rwtzy0b8oa";
import imgRectangle2 from "figma:asset/716f2f1afe00ecf3e01e5d1ea8c32e7b271e8dc3.png";

function Frame() {
  return (
    <div className="relative shrink-0 size-2" data-name="Frame">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 8"
      >
        <g clipPath="url(#clip0_9_407)" id="Frame">
          <path
            d={svgPaths.peb47b80}
            fill="var(--fill-0, #DF3B3B)"
            id="Vector"
            opacity="0.2"
          />
          <path
            d={svgPaths.p180ab780}
            fill="var(--fill-0, #DF3B3B)"
            id="Vector_2"
          />
        </g>
        <defs>
          <clipPath id="clip0_9_407">
            <rect fill="white" height="8" width="8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame47() {
  return (
    <div className="box-border content-stretch flex flex-row gap-1 items-start justify-end p-0 relative shrink-0">
      <Frame />
      <div
        className="font-['Archivo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#df3b3b] text-[8px] text-left text-nowrap"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal] whitespace-pre">9.5</p>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      <div
        className="font-['Archivo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#df3b3b] text-[8px] text-left text-nowrap"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal] whitespace-pre">2004</p>
      </div>
      <Frame47 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-[146.492px]">
      <div
        className="font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[8px] text-left w-full"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal]">Howl’s Moving Castle</p>
      </div>
      <Frame36 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7px] items-center justify-start p-0 relative shrink-0 w-[161.047px]">
      <div
        className="[background-size:100%_298.24%] bg-[0%_58.4%] bg-no-repeat h-[83.923px] relative shrink-0 w-full"
        style={{ backgroundImage: `url('${imgRectangle2}')` }}
      >
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame37 />
    </div>
  );
}

export default function Frame50() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative size-full">
      <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
      <Frame38 />
    </div>
  );
}