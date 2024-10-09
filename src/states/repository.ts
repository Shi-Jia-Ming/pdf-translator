import { createContext } from "react";

export const WorkDirectoryContext = createContext({
    workspace: '',
    setWorkspace: (_: string) => {}
});