import { createContext } from "react";
import { PdfInfo } from "../types/pdf.type";

export const PdfContext = createContext({
    activePdf: new PdfInfo(),
    setActivePdf: (_: PdfInfo) => {},
})