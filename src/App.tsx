import { useRef, useState } from "react";
// import reactLogo from "./assets/react.svg";
import { appWindow } from "@tauri-apps/api/window";
import "./styles/global.css";
import "./styles/rc-dock-extra.css";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import { WorkDirectoryContext } from "./states/repository";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { open } from "@tauri-apps/api/dialog";
import { path } from "@tauri-apps/api";

function App() {
  const [needAnimation, setNeedAnimation] = useState<boolean>(false);
  const [leftPanelSize, setLeftPanelSize] = useState<number>(20);

  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(false);
  const [isWindowMaximized, setIsWindowMaximized] = useState<boolean>(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const [workspace, setWorkspace] = useState('');

  const collapseLeftPanel = () => {
    setNeedAnimation(true);
    setTimeout(() => {
      setNeedAnimation(false);
    }, 200);
    if (isLeftPanelCollapsed) {
      leftPanelRef.current?.resize(leftPanelSize);
      setIsLeftPanelCollapsed(false);
    } else {
      setLeftPanelSize(leftPanelRef.current?.getSize() || 20);
      leftPanelRef.current?.resize(0);
      setIsLeftPanelCollapsed(true);
    }
  }

  async function handleMaximize() {
    setIsWindowMaximized(!isWindowMaximized);
    appWindow.toggleMaximize();
  }

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
    <WorkDirectoryContext.Provider value={{ workspace, setWorkspace }}>
      <div className={"size-full flex flex-row"}>
        <div className={"h-full w-11 flex flex-col align-middle justify-center"} id={"sidebar"}>
          <div className={"h-10 w-11 border-b border-[#e0e0e0] bg-[#fcfcfc]"}>
            <button
              className={"p-[0.55rem] size-full rounded-xl text-black hover:bg-gray-100 transition duration-200 flex align-middle justify-center"}
              id={"sidebar-collapse-button"}
              onClick={collapseLeftPanel}
            >
              <img alt={""} src={isLeftPanelCollapsed ? "/icons/indentation-right.svg" : "/icons/indentation-left.svg"} className={"size-5"} />
            </button>
          </div>
          <div className={"w-full h-except-10 border-r border-[#e0e0e0] transition-color duration-100 delay-100"} style={{ backgroundColor: isLeftPanelCollapsed ? '#ffffff' : '#f6f6f6' }}>
          </div>
        </div>
        <div className={"h-full w-except-11"} id={"app-main"}>
          <PanelGroup direction="horizontal" className={"size-full"} autoSaveId={"persistence"}>
            <Panel collapsible defaultSize={leftPanelSize} className={`transition-width ${needAnimation ? 'duration-200' : ''}`} ref={leftPanelRef}>
              <div className={"w-full h-except-10"}>
              <Sidebar />
              </div>
              <Popover className={"relative h-10 bg-[#f6f6f6] border-t border-[#e0e0e0"}>
                <PopoverButton id={"repo-selection"} className={"pl-4 pr-4 rounded-lg w-[200px] h-10 flex justify-start items-center hover:bg-gray-200 active:bg-gray-300"}>
                  <div id={"switch-icon"} className={"w-[20%]"}>
                    <img alt={""} src={"/icons/chevron-up.svg"} className={"size-5"} />
                  </div>
                  <div id={"repo-name"} className={" font-semibold text-base h-5 w-[80%] overflow-hidden whitespace-nowrap text-ellipsis text-left"}>
                    {workspace === '' ? '暂未打开任何仓库' : workspace}
                  </div>
                </PopoverButton>
                <PopoverPanel
                  transition
                  anchor={"top start"}
                  className={"divide-y divide-white/5 bg-white text-sm/6 border border-black-100 rounded-lg p-2 w-[300px] h-[400px] shadow-lg transition duration-200 ease-in-out  [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0"}>
                  {({ close }) => (
                    <button
                      className={"w-full h-8 hover:bg-gray-200 active:bg-gray-300 flex justify-start items-center rounded-lg p-2 gap-2"}
                      onClick={() => { updateWorkspace(close); }}
                    >
                      <div>
                        <img alt={""} src={"/icons/plus.svg"} className={"size-4"} />
                      </div>
                      <div>
                        打开新的仓库
                      </div>
                    </button>
                  )}
                </PopoverPanel>
              </Popover>
            </Panel>
            <PanelResizeHandle className={"hover:bg-purple-500 active:bg-purple-500 transition-colors duration-300"} />
            <Panel defaultSize={80}>
              <div className={"h-10 w-full border-r border-b border-[#e0e0e0] cursor-pointer bg-[#fcfcfc]"} data-tauri-drag-region={"true"}>
              </div>
              <MainView />
            </Panel>
          </PanelGroup>
        </div>
        <div id={"control-button-group"} className={"absolute right-0 top-0 h-10 w-auto flex flex-row z-10"}>
          <div className={"h-10 w-12 flex align-middle justify-center hover:bg-gray-100 active:bg-gray-200"} id={"minimize-button-container"}>
            <button className={"size-full flex justify-center items-center"} onClick={() => { appWindow?.minimize().then(() => { }) }}>
              <img alt={""} src={"/icons/minimize.svg"} className={"size-4"} />
            </button>
          </div>
          <div className={"h-10 w-12 flex align-middle justify-center hover:bg-gray-100 active:bg-gray-200"} id={"maximize-button-container"}>
            <button className={"size-full flex justify-center items-center"} onClick={handleMaximize}>
              <img alt={""} src={isWindowMaximized ? "/icons/scale-min.svg" : "/icons/scale-max.svg"} className={"size-4"} />
            </button>
          </div>
          <div className={"h-10 w-12 flex align-middle justify-center hover:bg-[#e93147] active:bg-[#f1626c]"} id={"close-button-container"}>
            <button className={"size-full flex justify-center items-center"} onClick={() => { appWindow?.close().then(() => { }) }}>
              <img alt={""} src={"/icons/close.svg"} className={"size-4"} />
            </button>
          </div>
        </div>
      </div>
    </WorkDirectoryContext.Provider>
  );
}

export default App;
