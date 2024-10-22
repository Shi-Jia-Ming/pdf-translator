import { createContext } from "react"

export const TabContext = createContext({
    activeTabName: '',
    setActiveTabName: (_: string) => {},
});