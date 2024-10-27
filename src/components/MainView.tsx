import "rc-dock/dist/rc-dock.css";
import { useContext, useEffect, useRef } from "react";
import DockGroup, { DockGroupRef } from "./dock/DockGroup";
import { PdfContext } from "../store/pdf";
import { TabContent } from "../types/tab.type";
import Pdf from "./Pdf";

export default function MainView() {
  const dockGroupRef = useRef<DockGroupRef>(null);

  const { activePdf } = useContext(PdfContext);

  useEffect(() => {
    if (activePdf.name !== "") {
      const newTab: TabContent = {
        index: -1,
        label: activePdf.name,
        content: <Pdf url={activePdf.path} />,
      };

      dockGroupRef.current?.addTab(newTab);
    }
  }, [activePdf]);

  return (
    <DockGroup ref={dockGroupRef} className={"size-full"}/>
  )
}