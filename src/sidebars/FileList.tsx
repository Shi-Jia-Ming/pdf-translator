import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react"
import { WorkDirectoryContext } from "../store/repository";
import { MacScrollbar } from "mac-scrollbar";
import { PdfInfo } from "../types/pdf.type";

export default function FileList() {

  const [pdfFileList, setPdfFileList] = useState<Array<PdfInfo>>([]);

  const {workPath} = useContext(WorkDirectoryContext);

  function setActive(file: PdfInfo) {
    pdfFileList.forEach((f) => {
      f.active = f.name === file.name;
    });
    setPdfFileList([...pdfFileList]);
  }

  useEffect(() => {
    invoke<Array<PdfInfo>>("get_pdf_list", {path: workPath}).then((res: Array<PdfInfo>) => {
      setPdfFileList(res);
    })
  }, [workPath]);

  return (
    <div className={"size-full flex justify-start items-start flex-col"}>
      <div className={"h-12 w-full p-2 flex justify-between items-center pl-2 pr-4"}>
        <div id={"title"} className={"text-sm connot-select overflow-hide"}>PDF文件列表</div>
        <div id={"toolbar"}>{/* TODO */}</div>
      </div>
      <MacScrollbar className={"size-full"}>
        {pdfFileList.map((file) => 
          <div
            key={file.name}
            className={`${file.active ? 'bg-gray-300' : 'hover:bg-gray-200 bg-transparent'} active:bg-gray-300 font-mono m-2 h-[30px] flex justify-start items-center px-2 rounded-lg overflow-hide cannot-select`}
            onClick={() => {setActive(file)}}
          >
            {file.name}
          </div>
        )}
      </MacScrollbar>
    </div>
  )
}