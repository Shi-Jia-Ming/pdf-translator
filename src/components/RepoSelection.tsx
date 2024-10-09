import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import NameImage from "./NameImage.tsx";
import {useContext} from "react";
import {WorkDirectoryContext} from "../states/repository.ts";
import {open} from "@tauri-apps/api/dialog";
import {path} from "@tauri-apps/api";

function RepoItem({name, path, needPath}: { name: string, path: string, needPath: boolean }) {
    return (
      <div
        className={"flex w-full h-12 pl-2 pr-2 rounded-lg items-center justify-start hover:bg-gray-200 active:bg-gray-300 gap-3"}>
        <NameImage name={name} size={needPath ? 27 : 20} color={'#8f8f8f'}/>
        <div className={"flex flex-col items-start justify-center"}>
          <div className={"text-[1rem]"}>{name}</div>
          <div hidden={!needPath} className={"text-gray-400 text-[0.8rem]"}>{path}</div>
        </div>
      </div>
    )
}

export default function RepoSelection() {
  const {workspace, setWorkspace} = useContext(WorkDirectoryContext);

  async function updateWorkspace(close: Function) {
    const newSpace = await open({
      multiple: false,
      directory: true
    });
    if (typeof newSpace === "string") {
      // 获取目录名称
      const dirs: string[] = newSpace.split(path.sep);
      setWorkspace(dirs[dirs.length - 1]);
    }
    close();
  }

  return (
    <Popover className={"relative size-full bg-[#f6f6f6] border-t border-[#e0e0e0"}>
      <PopoverButton id={"repo-selection"}
                     className={"pl-2 pr-2 rounded-lg w-[200px] h-10 flex justify-start items-center hover:bg-gray-200 active:bg-gray-300"}>
        <div id={"repo-name"}
             className={"text-[0.8rem] h-5 w-[85%] overflow-hidden whitespace-nowrap text-ellipsis text-left flex items-center"}>
          {workspace === '' ? '暂未打开任何仓库' : RepoItem({name: workspace, path: '', needPath: false})}
        </div>
        <div id={"switch-icon"} className={"w-[15%] flex justify-end"}>
          <img alt={""} src={"/icons/chevron-up.svg"} className={"size-5"}/>
        </div>
      </PopoverButton>
      <PopoverPanel
        transition
        anchor={"top start"}
        className={"divide-y divide-white/5 bg-white text-sm/6 border border-black-100 rounded-lg p-2 w-[300px] h-[400px] shadow-lg transition duration-200 ease-in-out  [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0"}>
        {({close}) => (
          <div className={"divide-y divide-solid"}>
            <button
              className={"w-full h-8 mb-1 hover:bg-gray-200 active:bg-gray-300 flex justify-start items-center rounded-lg p-2 gap-2"}
              onClick={() => {updateWorkspace(close).then();}}
            >
              <div>
                <img alt={""} src={"/icons/plus.svg"} className={"size-4"}/>
              </div>
              <div>打开新的仓库</div>
            </button>
            <div className={"p-2"}>
              <div id={"repo-list-title"} className={"font-bold text-[0.7rem]"}>
                最近的仓库
              </div>
              <button className={"w-full h-12"}>
                <RepoItem name={"test"} path={"C:/Users/xxx/xxx"} needPath={true}/>
              </button>
            </div>
          </div>
        )}
      </PopoverPanel>
    </Popover>
  )
}