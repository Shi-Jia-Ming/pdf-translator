import {SelectedWordContext} from "../store/selected.ts";
import {useContext, useEffect, useState} from "react";
import Toggle from "./Toggle.tsx";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import TranslateService from "../service/translate.service.ts";

function LockTip() {
  return (
    <div className={"text-[#6e7280] text-sm self-center size-full text-center flex items-center overflow-hide"}>
      锁定面板
      <Popover className={"relative flex justify-center items-center"}>
        <PopoverButton className={"size-[18px]"}>
          <img src={"/icons/questionmark-circle.svg"} width={18} height={18} className={"pl-1 border-none"} alt={""}/>
        </PopoverButton>
        <PopoverPanel
          transition
          anchor="bottom end"
          className="divide-y divide-white/5 bg-white text-sm/6 border border-black-100 rounded-lg p-2 w-[180px] shadow-lg transition duration-200 ease-in-out  [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0">
          锁定面板后，选中PDF中的单词或句子不会自动更新到翻译面板
        </PopoverPanel>
      </Popover>
    </div>
  );
}

export default function TranslateBar() {

  const {selectedWord} = useContext(SelectedWordContext);

  const [translatedWord, setTranslatedWord] = useState<string>('');
  const [wordToTranslate, setWordToTranslate] = useState<string>('');
  const [isWordLocked, setIsWordLocked] = useState<boolean>(false);

  useEffect(() => {
    if (!isWordLocked) {
      setWordToTranslate(selectedWord);
    }
  }, [selectedWord]);

  useEffect(() => {
    TranslateService.translate(wordToTranslate).then((res) => {
      setTranslatedWord(res);
    });
  }, [wordToTranslate]);

  return (
    <div id={"translate-bar"} className={"bg-gray-100 size-full p-2"}>
      <div id={"translate-title-bar"} className={"h-10 w-full flex flex-row justify-between items-center"}>
        <div id={"translate-title"} className={"text-black text-lg font-bold cannot-select overflow-hide"}>
          翻译面板
        </div>
        <div id={"function-buttons"} className={"flex items-center"}>
          <Toggle isOn={isWordLocked} setIsOn={setIsWordLocked} tip={LockTip()} height={20} width={35}/>
        </div>
      </div>
      <div id={"translate-content"} className={"size-full"}>
        <div id={"translation-container"} className={"h-1/2"}>
          <div id={"translation-title"} className={"cannot-select overflow-hide"}>翻译</div>
          <div id={"translation"} className={"bg-gray-300 w-full h-[90%] rounded-lg mt-2 p-2"}>
            <div id={"translation-function-group"} className={"h-5 w-full flex justify-end"}>
              <button id={"translation-copy-button"} className={"h-full flex flex-row items-center"}>
                <img src={"/icons/rectangle-on-rectangle.svg"} alt={""} width={16} height={16}/>
                <span className={"text-sm text-gray-600"}>复制</span>
              </button>
            </div>
            <div id={"translate-content"} className={"font-mono"}>{translatedWord}</div>
          </div>
        </div>
        <div id={"origin=container"} className={"h-1/2"}>
          <div id={"origin-title"} className={"cannot-select overflow-hide"}>原文</div>
          <div id={"origin"} className={"bg-gray-300 w-full h-[80%] rounded-lg mt-2 p-2"}>
            <div id={"origin-function-group"} className={"h-5 w-full flex justify-end"}>
              <button id={"origin-copy-button"} className={"h-full flex flex-row items-center"}>
                <img src={"/icons/rectangle-on-rectangle.svg"} alt={""} width={16} height={16}/>
                <span className={"text-sm text-gray-600"}>复制</span>
              </button>
            </div>
            <div id={"origin-content"} className={"font-mono"}>{wordToTranslate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}