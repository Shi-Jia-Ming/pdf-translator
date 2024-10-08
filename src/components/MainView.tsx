import DockLayout, { LayoutData } from "rc-dock";
import "rc-dock/dist/rc-dock.css";

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
                tabs: [
                    {id: 'tab1', title: 'tab1', content: DefaultComponent, closable: true},
                    {id: 'tab2', title: 'tab2', content: DefaultComponent, closable: true}
                ]
            }
        ]
    }
};


export default function MainView() {
    return (
        <DockLayout
            dockId={'main'}
            defaultLayout={defaultLayout}
            dropMode={'edge'}
            style={{width: '100%', height: '100%'}}
        />
    )
}