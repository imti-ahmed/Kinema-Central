export function ShortcutsTable() {
  const shortcuts = [
    { command: "Shift+N", action: "Search new entry" },
    { command: "Double Click", action: "Edit any card" },
    { command: "Shift+P", action: "Open Personal Tab" },
    { command: "Shift+G", action: "Open Global Tab" },
    { command: "Shift+.", action: "Open Stats Tab" },
    { command: "Shift+/", action: "Open Settings Tab" },
    { command: "Esc", action: "Close or cancel any dialog box or action" },
    { command: "Enter", action: "Accept or complete the action" }
  ];

  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-px pt-0 px-0 w-[360px]">
      {/* Header */}
      <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Shortcuts
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="bg-[#ffeded] h-[31px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-[25px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[90px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Command
              </div>
            </div>
            <div className="basis-0 box-border content-stretch flex flex-row gap-[99px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Action
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rows */}
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="bg-[#ffffff] h-[31px] mb-[-1px] relative shrink-0 w-full">
          <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
          <div className="flex flex-row items-center relative size-full">
            <div className="box-border content-stretch flex flex-row gap-[25px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
              <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[90px]">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {shortcut.command}
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex flex-row gap-[99px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {shortcut.action}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}