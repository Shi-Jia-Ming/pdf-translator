import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export default function FileList() {
  return (
    <div className={"size-full flex justify-start items-end"}>
      <Popover className={"relative"}>
        <PopoverButton id={"repo-selection"} className={"m-4 p-4 rounded-lg w-[220px] h-12 flex justify-center items-center hover:bg-gray-200 active:bg-gray-300"}>
          <div id={"switch-icon"} className={"w-[20%]"}>
            <img alt={""} src={"/icons/chevron-up.svg"} className={"size-5"} />
          </div>
          <div id={"repo-name"} className={"font-semibold text-md h-5 w-[80%] overflow-hidden whitespace-nowrap text-ellipsis"}>
            Current Repository
          </div>
        </PopoverButton>
        <PopoverPanel
          transition
          anchor={"top start"}
          className={"divide-y divide-white/5 bg-white text-sm/6 border border-black-100 rounded-lg p-2 w-[300px] h-[400px] transition duration-200 ease-in-out  [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0"}>
          <button className={"w-full h-8 hover:bg-gray-200 active:bg-gray-300 flex justify-start items-center rounded-lg p-2 gap-2"}>
            <div>
              <img alt={""} src={"/icons/plus.svg"} className={"size-4"}/>
            </div>
            <div>
              打开新的仓库
            </div>
          </button>
        </PopoverPanel>
      </Popover>

    </div>
  )
}