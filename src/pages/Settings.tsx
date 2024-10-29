import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api";
import { TranslateApi } from "../types/translate.api.type";

export default function Settings() {
  const [api, setApi] = useState<TranslateApi>(new TranslateApi());
  
  useEffect(() => {
    invoke("get_translate_api").then((initial) => {
      console.log("initial api: ", initial);
      setApi(initial as TranslateApi);
    });
  }, []);

  const saveTranslateApi = () => {
    const apiName = document.querySelector("#api-name input") as HTMLInputElement;
    const apiUrl = document.querySelector("#api-url input") as HTMLInputElement;
    const apiToken = document.querySelector("#api-token input") as HTMLInputElement;
    invoke("update_translate_api", {name: apiName.value, url: apiUrl.value, token: apiToken.value}).then(() => {
      console.log("API saved: ", apiName.value, apiUrl.value, apiToken.value);
    });
  }

  return (
    <div id={"setting-view"} className={"size-full p-6"}>
      <h1 className={"text-3xl m-5 mt-0"}>设置</h1>
      <div className={"w-full h-[3px] bg-gray-200"}/>
      <div id={"window-main"} className={"size-full flex flex-row"}>
        <nav className={"w-1/4 h-full flex justify-start items-start border-r border-gray-200 bg-white"}>
          <ul className={"flex flex-col justify-start items-start w-full"}>
            <li className={"p-2"}>翻译服务API</li>
          </ul>
        </nav>
        <main className={"text-base"}>
          <div id={"settings-container"} className={"size-full p-6"}>
            <div id={"api-settings"}>
              <div className={"text-xl mb-2"}>翻译服务API</div>
              <div id={"api-settings-form"} className={"size-full"}>
                <div id={"api-name"}
                     className={"w-[80%] size-full flex flex-row items-center gap-2 h-12 justify-between"}>
                  <span>API名称</span>
                  <input
                    className={"w-[80%] transition-colors border focus:border-blue-400 focus-visible:outline-none rounded-md p-1"}
                    value={api.name}
                    onChange={(e) => {setApi({...api, name: e.target.value}); saveTranslateApi();}}
                  />
                </div>
                <div id={"api-url"}
                     className={"w-[80%] size-full flex flex-row items-center gap-2 h-12 justify-between"}>
                  <span>API URL</span>
                  <input
                    className={"w-[80%] transition-colors border focus:border-blue-400 focus-visible:outline-none rounded-md p-1"}
                    value={api.url}
                    onChange={(e) => {setApi({...api, url: e.target.value}); saveTranslateApi();}}
                  />
                </div>
                <div id={"api-token"}
                     className={"w-[80%] size-full flex flex-row items-center gap-2 h-12 justify-between"}>
                  <span>API Token</span>
                  <input
                    className={"w-[80%] transition-colors border focus:border-blue-400 focus-visible:outline-none rounded-md p-1"}
                    value={api.token}
                    onChange={(e) => {setApi({...api, token: e.target.value}); saveTranslateApi();}}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}