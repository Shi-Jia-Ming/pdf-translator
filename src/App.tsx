import { useRef, useState } from "react";
// import reactLogo from "./assets/react.svg";
import "./styles/global.css";
import "./styles/rc-dock-extra.css";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import { WorkDirectoryContext } from "./store/repository";
import Toolbar from "./components/Toolbar.tsx";
import { PdfInfo } from "./types/pdf.type.ts";
import { PdfContext } from "./store/pdf.ts";
import { TabContext } from "./store/tab.ts";

function App() {
  // TODO animation bug
  const [needAnimationL, setNeedAnimationL] = useState<boolean>(false);
  const [needAnimationR, setNeedAnimationR] = useState<boolean>(false);
  const [leftPanelSize, setLeftPanelSize] = useState<number>(20);
  const [rightPanelSize, setRightPanelSize] = useState<number>(20);

  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState<boolean>(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const [workspace, setWorkspace] = useState('');
  const [workPath, setWorkPath] = useState('');

  const [activePdf, setActivePdf] = useState<PdfInfo>(new PdfInfo());
  const [activeTabName, setActiveTabName] = useState<string>('');

  const collapseLeftPanel = () => {
    setNeedAnimationL(true);
    setTimeout(() => {
      setNeedAnimationL(false);
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

  const collapseRightPanel = () => {
    setNeedAnimationR(true);
    setTimeout(() => {
      setNeedAnimationR(false);
    }, 200);
    if (isRightPanelCollapsed) {
      rightPanelRef.current?.resize(rightPanelSize);
      setIsRightPanelCollapsed(false);
    } else {
      setRightPanelSize(rightPanelRef.current?.getSize() || 20);
      rightPanelRef.current?.resize(0);
      setIsRightPanelCollapsed(true);
    }
  }

  return (
    <WorkDirectoryContext.Provider value={{ workspace, workPath, setWorkspace, setWorkPath }}>
      <PdfContext.Provider value={{ activePdf, setActivePdf }}>
        <TabContext.Provider value={{ activeTabName, setActiveTabName }}>
          <div className={"size-full flex flex-col"} id={"main-window"}>
            <div className={"w-full h-10"} id={"tool-bar-container"}>
              <Toolbar collapseRightPanel={collapseRightPanel}/>
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
                    className={"size-5"} />
                </button>
              </div>
              <div className={"h-full w-except-12"} id={"app-main"}>
                <PanelGroup direction="horizontal" className={"size-full"} autoSaveId={"persistence"}>
                  <Panel collapsible defaultSize={leftPanelSize}
                    className={`${needAnimationL ? 'transition-width duration-200' : 'transition-none'}`} ref={leftPanelRef}>
                    <Sidebar />
                  </Panel>
                  <PanelResizeHandle
                    className={"hover:bg-purple-500 active:bg-purple-500 transition-colors duration-300"} />
                  <Panel className={"flex-1"}>
                    <MainView />
                  </Panel>
                  <PanelResizeHandle
                    className={"hover:bg-purple-500 active:bg-purple-500 transition-colors duration-300"} />
                  <Panel collapsible defaultSize={rightPanelSize}
                    className={`${needAnimationR ? 'transition-width duration-200' : ''}`} ref={rightPanelRef}>
                      <div className={"w-full h-full bg-gray-100"}></div>
                  </Panel>
                </PanelGroup>
              </div>
            </div>
          </div>
        </TabContext.Provider>
      </PdfContext.Provider>
    </WorkDirectoryContext.Provider>
  );
}

export default App;
