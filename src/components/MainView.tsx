import "rc-dock/dist/rc-dock.css";
import {useContext, useEffect, useRef} from "react";
import DockGroup, {DockGroupRef} from "./dock/DockGroup";
import {PdfContext} from "../store/pdf";
import {TabContent} from "../types/tab.type";
import Pdf from "./Pdf";
import {getCurrent, WebviewWindow} from '@tauri-apps/api/window';
import Settings from "../pages/Settings.tsx";

export default function MainView() {
  const dockGroupRef = useRef<DockGroupRef>(null);

  const {activePdf} = useContext(PdfContext);

  useEffect(() => {
    const appWebview: WebviewWindow = getCurrent();
    appWebview.listen("open_setting_window", () => {
      dockGroupRef.current?.addTab({
        index: -1,
        label: "设置",
        content: <Settings/>,
      });
    }).then();
  });

  useEffect(() => {
    if (activePdf.name !== "") {
      const newTab: TabContent = {
        index: -1,
        label: activePdf.name,
        content: <Pdf url={activePdf.path}/>,
      };

      dockGroupRef.current?.addTab(newTab);
    }
  }, [activePdf]);

  return (
    <DockGroup ref={dockGroupRef} className={"size-full"}/>
  )
}