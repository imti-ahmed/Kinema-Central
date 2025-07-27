import svgPaths from "../imports/svg-1pscinn220";

function KinemaCentralIcon() {
  return (
    <div className="relative shrink-0 size-[16.05px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 17 17"
      >
        <g>
          <path
            d={svgPaths.p2329b900}
            fill="#555E77"
          />
          <path
            d={svgPaths.p36017000}
            fill="#424C63"
          />
          <path
            d={svgPaths.p3f7e1371}
            fill="#EFF3F9"
          />
          <path
            d={svgPaths.pc225980}
            fill="#CFE0F3"
          />
          <path
            d={svgPaths.p11f8f400}
            fill="#EFF3F9"
          />
          <path
            d={svgPaths.p30714700}
            fill="#CFE0F3"
          />
          <path
            d={svgPaths.p3b7189f0}
            fill="#555E77"
          />
          <path
            d={svgPaths.p3a46f680}
            fill="#424C63"
          />
          <path
            d={svgPaths.p11d5800}
            fill="#EFF3F9"
          />
          <path
            d={svgPaths.p13f44880}
            fill="#CFE0F3"
          />
          <path
            d={svgPaths.p1b283280}
            fill="#EFF3F9"
          />
          <path
            d={svgPaths.p2d7fb1c0}
            fill="#CFE0F3"
          />
          <g>
            <path
              d={svgPaths.p26828d80}
              fill="#08105E"
            />
            <path
              d={svgPaths.p1c1fbfc0}
              fill="#08105E"
            />
            <path
              d={svgPaths.p3b738b00}
              fill="#08105E"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TabIcon({ pathFill, pathOutline, isActive }: { pathFill: string; pathOutline: string; isActive: boolean }) {
  const fillColor = isActive ? "#DF3B3B" : "#FFC0C0";
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g>
          <path
            d={pathFill}
            fill={fillColor}
            opacity="0.2"
          />
          <path
            d={pathOutline}
            fill={fillColor}
          />
        </g>
      </svg>
    </div>
  );
}

function StatsIcon() {
  return (
    <div className="relative shrink-0 size-4">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g>
          <path
            d="M13 2.5V13H9.5V2.5H13Z"
            fill="#DF3B3B"
            opacity="0.2"
          />
          <path
            d={svgPaths.p36934e00}
            fill="#DF3B3B"
          />
        </g>
      </svg>
    </div>
  );
}

function ReadMeIcon() {
  return (
    <div className="relative shrink-0 size-4">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g>
          <path
            d={svgPaths.pcc49800}
            fill="#FFC0C0"
            opacity="0.2"
          />
          <path
            d={svgPaths.p2df11b00}
            fill="#FFC0C0"
          />
        </g>
      </svg>
    </div>
  );
}

function RedThemeIcon() {
  return (
    <div className="relative shrink-0 size-4">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g>
          <path
            d={svgPaths.p3b4ded00}
            fill="#DF3B3B"
            opacity="0.2"
          />
          <path
            d={svgPaths.p39a61880}
            fill="#DF3B3B"
          />
        </g>
      </svg>
    </div>
  );
}

function UserIcon() {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g>
          <path
            d={svgPaths.p141e4800}
            fill="#DF3B3B"
            opacity="0.2"
          />
          <path
            d={svgPaths.p2024b600}
            fill="#DF3B3B"
          />
        </g>
      </svg>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-[10.277px] relative shrink-0 w-0">
      <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 2 11"
        >
          <path
            d="M1 0V10.2774"
            stroke="#DF3B3B"
          />
        </svg>
      </div>
    </div>
  );
}

interface StatsHeaderProps {
  activeMainTab: 'global' | 'personal' | 'stats';
  onMainTabChange: (tab: 'global' | 'personal' | 'stats') => void;
}

export function StatsHeader({ activeMainTab, onMainTabChange }: StatsHeaderProps) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="box-border content-stretch flex flex-row items-center justify-between pb-4 pt-6 px-6 w-full max-w-7xl mx-auto">
        <div className="absolute border-[#ffebeb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
        
        {/* Left side - Logo */}
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0">
          <KinemaCentralIcon />
          <div
            className="font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[normal] whitespace-pre">
              Kinema Central 1.0.0
            </p>
          </div>
        </div>

        {/* Right side - Navigation */}
        <div className="box-border content-stretch flex flex-row gap-[18px] items-center justify-start p-0 relative shrink-0">
          {/* Global Tab */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onMainTabChange('global')}
          >
            <TabIcon 
              pathFill={svgPaths.p3c32e380} 
              pathOutline={svgPaths.p28e31700} 
              isActive={activeMainTab === 'global'} 
            />
            <div
              className={`font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap ${
                activeMainTab === 'global' ? 'text-[#df3b3b]' : 'text-[#ffc0c0]'
              }`}
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="block leading-[normal] whitespace-pre">Global</p>
            </div>
          </button>

          {/* Personal Tab */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onMainTabChange('personal')}
          >
            <TabIcon 
              pathFill={svgPaths.p317fbd00} 
              pathOutline={svgPaths.p894ff80} 
              isActive={activeMainTab === 'personal'} 
            />
            <div
              className={`font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap ${
                activeMainTab === 'personal' ? 'text-[#df3b3b]' : 'text-[#ffc0c0]'
              }`}
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="block leading-[normal] whitespace-pre">Personal</p>
            </div>
          </button>

          <Divider />

          {/* Stats Tab - Active */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onMainTabChange('stats')}
          >
            <StatsIcon />
            <div
              className="font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="block leading-[normal] whitespace-pre">Stats</p>
            </div>
          </button>

          {/* Read Me Tab */}
          <button className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer">
            <ReadMeIcon />
            <div
              className="font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffc0c0] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="block leading-[normal] whitespace-pre">Read Me</p>
            </div>
          </button>

          <Divider />

          {/* Red Theme Tab */}
          <button className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer">
            <RedThemeIcon />
            <div
              className="font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="block leading-[normal] whitespace-pre">Red Theme</p>
            </div>
          </button>

          {/* User Tab */}
          <button className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer">
            <UserIcon />
            <div
              className="font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="block leading-[normal] whitespace-pre">Heyo, Imti</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}