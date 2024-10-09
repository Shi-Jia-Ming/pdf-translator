import {useRef, useState} from "react";
// import reactLogo from "./assets/react.svg";
import {appWindow} from "@tauri-apps/api/window";
import "./styles/global.css";
import "./styles/rc-dock-extra.css";
import {ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import {WorkDirectoryContext} from "./states/repository";
import RepoSelection from "./components/RepoSelection.tsx";

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
    await appWindow.toggleMaximize();
  }

  return (
    <WorkDirectoryContext.Provider value={{workspace, setWorkspace}}>
      <div className={"size-full flex flex-col"} id={"main-window"}>
        <div className={"w-full h-10 flex justify-between items-center cursor-pointer"} id={"tool-bar"} data-tauri-drag-region={"true"}>
          <div className={""} id={"function-area"}>
            <div className={"h-7 w-full"}>
              <RepoSelection/>
            </div>
          </div>
          <div id={"control-button-group-area"} className={"absolute right-0 top-0 h-10 w-auto flex flex-row z-10"}>
            <div className={"h-10 w-12 flex align-middle justify-center hover:bg-gray-100 active:bg-gray-200"}
                 id={"minimize-button-container"}>
              <button className={"size-full flex justify-center items-center"} onClick={() => {
                appWindow?.minimize().then(() => {
                })
              }}>
                <img alt={""} src={"/icons/minimize.svg"} className={"size-4"}/>
              </button>
            </div>
            <div className={"h-10 w-12 flex align-middle justify-center hover:bg-gray-100 active:bg-gray-200"}
                 id={"maximize-button-container"}>
              <button className={"size-full flex justify-center items-center"} onClick={handleMaximize}>
                <img alt={""} src={isWindowMaximized ? "/icons/scale-min.svg" : "/icons/scale-max.svg"}
                     className={"size-4"}/>
              </button>
            </div>
            <div className={"h-10 w-12 flex align-middle justify-center hover:bg-[#e93147] active:bg-[#f1626c]"}
                 id={"close-button-container"}>
              <button className={"size-full flex justify-center items-center"} onClick={() => {
                appWindow?.close().then(() => {
                })
              }}>
                <img alt={""} src={"/icons/close.svg"} className={"size-4"}/>
              </button>
            </div>
          </div>
        </div>
        <div className={"w-full h-except-10 flex"} id={"app-main"}>
          <div
            className={"h-full w-12 flex flex-col items-center justify-start bg-[#f6f6f6] border-r border-[#e0e0e0] pt-1 pb-1"}
            id={"sidebar"}>
            <button
              className={"p-[0.55rem] size-10 rounded-lg text-black hover:bg-gray-200 active:bg-gray-200 transition duration-200 flex align-middle justify-center"}
              id={"sidebar-collapse-button"}
              onClick={collapseLeftPanel}
            >
              <img alt={""}
                   src={isLeftPanelCollapsed ? "/icons/indentation-right.svg" : "/icons/indentation-left.svg"}
                   className={"size-5"}/>
            </button>
          </div>
          <div className={"h-full w-except-12"} id={"app-main"}>
            <PanelGroup direction="horizontal" className={"size-full"} autoSaveId={"persistence"}>
              <Panel collapsible defaultSize={leftPanelSize}
                     className={`transition-width ${needAnimation ? 'duration-200' : ''}`} ref={leftPanelRef}>
                <Sidebar/>
              </Panel>
              <PanelResizeHandle
                className={"hover:bg-purple-500 active:bg-purple-500 transition-colors duration-300"}/>
              <Panel defaultSize={80}>
                <MainView/>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </div>
    </WorkDirectoryContext.Provider>
  );
}

export default App;
