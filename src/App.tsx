import { useRef, useState } from "react";
import "./styles/global.css";
import "./styles/rc-dock-extra.css";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import { WorkDirectoryContext } from "./store/repository";
import Toolbar from "./components/Toolbar.tsx";
import { PdfInfo } from "./types/pdf.type.ts";
import { PdfContext } from "./store/pdf.ts";
import { TabContext } from "./store/tab.ts";
import PanelGroup, { PanelGroupRef } from "./components/panel/PanelGroup";
import {LeftPanel, MainPanel, RightPanel} from "./components/panel/Panel";

function App() {
  const panelGroupRef = useRef<PanelGroupRef>(null);

  const [workspace, setWorkspace] = useState('');
  const [workPath, setWorkPath] = useState('');

  const [activePdf, setActivePdf] = useState<PdfInfo>(new PdfInfo());
  const [activeTabName, setActiveTabName] = useState<string>('');

  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  return (
    <WorkDirectoryContext.Provider value={{ workspace, workPath, setWorkspace, setWorkPath }}>
      <PdfContext.Provider value={{ activePdf, setActivePdf }}>
        <TabContext.Provider value={{ activeTabName, setActiveTabName }}>
          <div className={"size-full flex flex-col"} id={"main-window"}>
            <div className={"w-full h-10"} id={"tool-bar-container"}>
              <Toolbar collapseRightPanel={() => {panelGroupRef.current?.collapseRight();}} isRightPanelCollapsed={isRightPanelCollapsed}/>
            </div>
            <div className={"w-full h-except-10 flex"} id={"app-main"}>
              <div
                className={"h-full w-12 flex flex-col items-center justify-start bg-[#f6f6f6] border-r border-[#e0e0e0] pt-1 pb-1"}
                id={"sidebar"}>
                <button
                  className={"p-[0.55rem] size-10 rounded-lg text-black hover:bg-gray-200 active:bg-gray-200 transition duration-200 flex align-middle justify-center"}
                  id={"sidebar-collapse-button"}
                  onClick={() => {panelGroupRef.current?.collapseLeft();}}
                >
                  <img alt={""}
                    src={isLeftPanelCollapsed ? "/icons/indentation-right.svg" : "/icons/indentation-left.svg"}
                    className={"size-5"} />
                </button>
              </div>
              <div className={"h-full w-except-12"} id={"app-main"}>
                <PanelGroup 
                  ref={panelGroupRef}
                  handleLeftCollapse={setIsLeftPanelCollapsed}
                  handleRightCollapse={setIsRightPanelCollapsed}
                >
                  <LeftPanel>
                    <Sidebar />
                  </LeftPanel>
                  <MainPanel>
                    <MainView />
                  </MainPanel>
                  <RightPanel>
                    <div className={"bg-gray-100 size-full"}/>
                  </RightPanel>
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
