import { useState } from "react"
import FileList from "../sidebars/FileList";

export type SidebarItem = {
  index: number;
  icon: string;
  component: Function;
}

const sidebarItems: SidebarItem[] = [
  {
    index: 0,
    icon: 'file-list.svg',
    component: FileList
  }
]

export default function Sidebar() {
  const [currentActive, setCurrentActive] = useState<number>(0);

  return (
    <div className={"size-full"}>
      <div className={"h-10 w-full pl-2 border-r border-b border-[#e0e0e0] cursor-pointer bg-[#fcfcfc] flex justify-start items-center"} data-tauri-drag-region={"true"}>
        {sidebarItems.map((sidebarItem: SidebarItem) => {
          return (
            <button
              className={"w-[2rem] h-[1.5rem] rounded-lg text-black bg-white hover:bg-gray-100 transition duration-200 flex align-middle justify-center"}
              id={sidebarItem.index.toString()}
              key={sidebarItem.index}
              style={{ backgroundColor: sidebarItem.index === currentActive ? '#e9e9e9' : '#fcfcfc' }}
              onClick={() => { setCurrentActive(sidebarItem.index); }}
            >
              <img alt={""} src={`/icons/${sidebarItem.icon}`} className={"size-5"} />
            </button>
          )
        })}
      </div>
      <div className={"h-except-10 w-full bg-[#f6f6f6] border-r border-[#e0e0e0]"}>
        {sidebarItems.filter((sidebarItem) => {
          return sidebarItem.index === currentActive;
        })[0].component()}
      </div>
    </div>
  )
}