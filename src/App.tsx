import { useRef, useState } from "react";
// import reactLogo from "./assets/react.svg";
import { appWindow } from "@tauri-apps/api/window";
import "./App.css";
import "./styles/global.css";
import "./styles/rc-dock-extra.css";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainView from "./components/MainView";

function App() {
  const [needAnimation, setNeedAnimation] = useState<boolean>(false);
  const [leftPanelSize, setLeftPanelSize] = useState<number>(20);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const collapseLeftPanel = () => {
    setNeedAnimation(true);
    setTimeout(() => {
        setNeedAnimation(false);
    }, 200);
    if (leftPanelRef.current?.getSize() === 0) {
      leftPanelRef.current?.resize(leftPanelSize);
      setIsLeftPanelCollapsed(false);
    } else {
      setLeftPanelSize(leftPanelRef.current?.getSize() || 20);
      leftPanelRef.current?.resize(0);
      setIsLeftPanelCollapsed(true);
    }
  }

  return (
    <div className={"size-full flex flex-row"}>
    <div className={"h-full w-11 flex flex-col align-middle justify-center"} id={"sidebar"}>
      <div className={"h-10 w-11 border-b border-[#e0e0e0]"}>
        <button
          className={"p-2.5 size-full rounded-xl text-black bg-white hover:bg-gray-100 transition duration-200 flex align-middle justify-center"}
          id={"sidebar-collapse-button"}
          onClick={collapseLeftPanel}
        >
          <img alt={""} src={"/icons/indentation-right.svg"} className={"size-5"}/>
        </button>
      </div>
      <div className={"w-full h-except-10 border-r border-[#e0e0e0] transition-color duration-100 delay-100"} style={{backgroundColor: isLeftPanelCollapsed ? '#ffffff' : '#f6f6f6'}}>
      </div>
    </div>
    <div className={"h-full w-except-11"} id={"app-main"}>
      <PanelGroup direction="horizontal" className={"size-full"} autoSaveId={"persistence"}>
        <Panel collapsible defaultSize={leftPanelSize} className={`transition-width ${needAnimation ? 'duration-200' : ''}`} ref={leftPanelRef}>
          <div className={"h-10 w-full border-r border-b border-[#e0e0e0] cursor-pointer"} data-tauri-drag-region={"true"}>
          </div>
          <div className={"h-except-10 w-full bg-[#f6f6f6] border-r border-[#e0e0e0]"}>
          </div>
        </Panel>
        <PanelResizeHandle className={"hover:bg-purple-500 active:bg-purple-500 transition-colors duration-300"}/>
        <Panel defaultSize={80}>
          <div className={"h-10 w-full border-r border-b border-[#e0e0e0] cursor-pointer"} data-tauri-drag-region={"true"}>
          </div>
          <MainView/>
        </Panel>
      </PanelGroup>
    </div>
    <div id={"control-button-group"} className={"absolute right-0 top-0 h-10 w-auto flex flex-row z-10"}>
      <div className={"h-10 w-12 flex align-middle justify-center hover:bg-gray-100 active:bg-gray-200"} id={"minimize-button-container"}>
        <button className={"size-full flex justify-center items-center"} onClick={() => {appWindow?.minimize().then(() => {})}}>
          <img alt={""} src={"/icons/minimize.svg"} className={"size-4"}/>
        </button>
      </div>
      <div className={"h-10 w-12 flex align-middle justify-center hover:bg-gray-100 active:bg-gray-200"} id={"maximize-button-container"}>
        <button className={"size-full flex justify-center items-center"} onClick={() => {appWindow?.toggleMaximize().then(() => {console.log('toggleMax')});}}>
          <img alt={""} src={"/icons/scale-min.svg"} className={"size-4"}/>
        </button>
      </div>
      <div className={"h-10 w-12 flex align-middle justify-center hover:bg-[#e93147] active:bg-[#f1626c]"} id={"close-button-container"}>
        <button className={"size-full flex justify-center items-center"} onClick={() => {appWindow?.close().then(() => {})}}>
          <img alt={""} src={"/icons/close.svg"} className={"size-4"}/>
        </button>
      </div>
    </div>
  </div>
  );
}

export default App;
