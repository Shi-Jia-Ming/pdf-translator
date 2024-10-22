import DockLayout, { BoxData, DropDirection, LayoutBase, LayoutData, PanelData, TabData } from "rc-dock";
import "rc-dock/dist/rc-dock.css";
import { useContext, useEffect, useRef, useState } from "react";
import Pdf from "./Pdf";
import { PdfContext } from "../store/pdf";
import { WorkDirectoryContext } from "../store/repository";
import { PdfInfo } from "../types/pdf.type";
import { TabContext } from "../store/tab";

function DefaultComponent() {
  const [state, setState] = useState('Hello World');
  return <div className={"bg-amber-100 size-full"}>{state}</div>
}

const defaultLayout: LayoutData = {
  dockbox: {
    id: 'dockbox',
    mode: 'horizontal',
    children: [
      {
        id: 'root',
        tabs: []
      }
    ]
  }
};


export default function MainView() {
  const dockLayout = useRef<DockLayout>(null);

  const { activePdf } = useContext(PdfContext);
  const { setActiveTabName } = useContext(TabContext);

  useEffect(() => {
    const layout = dockLayout.current?.getLayout();
    (layout?.dockbox.children[0] as PanelData).id = 'root';
    (layout?.dockbox.children[0] as PanelData).group = 'custom';
    dockLayout.current?.setLayout(layout!);
  });

  useEffect(() => {
    if (activePdf.name !== "") {
      const tab: TabData = {id: activePdf.name, title: activePdf.name, content: <Pdf url={activePdf.path}/>, closable: true};
      // TODO multi tab group
      dockLayout.current?.dockMove(tab, 'root', 'middle');
    }
  }, [activePdf]);

  // TODO have bugs when closing tab
  function changeActivePdf(_newLayout: LayoutBase, currentTabId?: string, _direction?: DropDirection) {
    if (currentTabId) {
      setActiveTabName(currentTabId);
    }
  }

  return (
    <DockLayout
      ref={dockLayout}
      dockId={'main'}
      defaultLayout={defaultLayout}
      dropMode={'edge'}
      style={{ width: '100%', height: '100%' }}
      onLayoutChange={changeActivePdf}
    />
  )
}