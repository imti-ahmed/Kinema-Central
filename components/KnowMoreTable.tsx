export function KnowMoreTable() {
  const features = [
    { feature: "Global", description: "List of all the entries, users and their ratings" },
    { feature: "Personal", description: "Customized user space to track your own movies/show and maintain lists" },
    { feature: "Stats", description: "View different stats of the Kinema Central" },
    { feature: "Theme", description: "Change and apply different themes across the website" }
  ];

  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-px pt-0 px-0 w-[720px]">
      {/* Header */}
      <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Know More
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="bg-[#ffeded] h-[31px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[100px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Feature
              </div>
            </div>
            <div className="basis-0 box-border content-stretch flex flex-row gap-[99px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Description
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rows */}
      {features.map((feature, index) => (
        <div key={index} className="bg-[#ffffff] h-[31px] mb-[-1px] relative shrink-0 w-full">
          <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
          <div className="flex flex-row items-center relative size-full">
            <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
              <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[100px]">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {feature.feature}
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex flex-row gap-[99px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {feature.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}