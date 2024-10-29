import {createContext} from "react";

export const SelectedWordContext = createContext({
  selectedWord: '',
  setSelectedWord: (_: string) => {},
})