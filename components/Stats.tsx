import { StatsSearchAndFilters } from "./StatsSearchAndFilters";
import { SiteStatsTable } from "./SiteStatsTable";
import { PersonalStatsTable } from "./PersonalStatsTable";
import { MVPUsersTable } from "./MVPUsersTable";

export function Stats() {
  return (
    <>
      <StatsSearchAndFilters />
      
      {/* Content Area */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen pt-[24px]">
        <div className="w-full max-w-7xl mx-auto pb-[14px] min-h-[600px]">
          <div className="flex gap-6 items-start">
            {/* Left Column */}
            <div className="flex flex-col gap-[23px] w-[292px]">
              <SiteStatsTable />
              <MVPUsersTable />
            </div>
            
            {/* Right Column */}
            <div className="flex-1">
              <PersonalStatsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}