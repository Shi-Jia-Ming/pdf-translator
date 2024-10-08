import DockLayout, { LayoutData } from "rc-dock";
import "rc-dock/dist/rc-dock.css";
import { useEffect } from "react";

function DefaultComponent() {
    return <div className={"bg-amber-100 size-full"}>Hello World</div>
}

const defaultLayout: LayoutData = {
    dockbox: {
        id: 'dockbox',
        mode: 'horizontal',
        children: [
            {
                id: 'root',
                group: 'nodraggable',
                tabs: [
                    {id: 'tab1', title: 'tab1', content: DefaultComponent, closable: true},
                    {id: 'tab2', title: 'tab2', content: DefaultComponent, closable: true}
                ]
            }
        ]
    }
};

const groups = {
    nodraggable: {
        floatable: false,
        maximizable: false,
    },
};

export default function MainView() {

    useEffect(() => {
        const draggable = document.querySelectorAll('.dock-nav-wrap');
        if (draggable) {
            draggable.forEach((draggableElement) => {
                console.log(draggable);
                // draggableElement.setAttribute('style', 'z-index: 1;');
                draggableElement.setAttribute('data-tauri-drag-region', 'true');
                draggableElement.setAttribute('draggable', 'false');
            });
        }

        const tabs = document.querySelectorAll('.dock-nav-list');
        if (tabs) {
            tabs.forEach((tab) => {
                tab.setAttribute('style', 'z-index: 1;');
            })
        }
    });

    const onLayoutChange = () => {
        setTimeout(() => {
            const draggable = document.querySelectorAll('.dock-nav-wrap');
            if (draggable) {
                draggable.forEach((draggableElement) => {
                    draggableElement.setAttribute('data-tauri-drag-region', 'true');
                    draggableElement.setAttribute('draggable', 'false');
                });
            }
        }, 100);

    }

    return (
        <DockLayout
            dockId={'main'}
            defaultLayout={defaultLayout}
            groups={groups}
            dropMode={'edge'}
            style={{width: '100%', height: '100%'}}
            onLayoutChange={onLayoutChange}
        />
    )
}