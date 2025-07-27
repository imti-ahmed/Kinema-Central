import { StatsSearchAndFilters } from "./StatsSearchAndFilters";
import { ShortcutsTable } from "./ShortcutsTable";
import { UpdateLogTable } from "./UpdateLogTable";
import { HowToTable } from "./HowToTable";
import { KnowMoreTable } from "./KnowMoreTable";
import { MeaningsTable } from "./MeaningsTable";

export function Settings() {
  return (
    <>
      <StatsSearchAndFilters />
      
      {/* Content Area */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen pt-[24px]">
        <div className="w-full max-w-7xl mx-auto pb-[14px] min-h-[600px]">
          <div className="flex gap-6 items-start">
            {/* Left Column */}
            <div className="box-border content-stretch flex flex-col gap-[23px] items-start justify-start p-0 relative shrink-0 w-[360px]">
              <ShortcutsTable />
              <UpdateLogTable />
            </div>
            
            {/* Right Column */}
            <div className="box-border content-stretch flex flex-col gap-[23px] items-start justify-start p-0 relative shrink-0 w-[720px]">
              <HowToTable />
              <KnowMoreTable />
              <MeaningsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}