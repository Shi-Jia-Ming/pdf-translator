import {Body, getClient, Response} from "@tauri-apps/api/http";
import {invoke} from "@tauri-apps/api/tauri";

export default class TranslateService {
    // TODO user select the origin and target language in translation, for now it is hardcoded from en to zh
    private static translateUrl: string = "";
    private static translateToken: string = "";

    public static async translate(key: string): Promise<string> {
        // handle key, remove the special characters in the key
        const sanitizedKey = key.replace(/[\n\r]/g, '');

        const client = await getClient();
        const body: Body = Body.json({
            text: sanitizedKey,
            source_lang: "en",
            target_lang: "zh"
        });

        // check the translateUrl and token
        if (TranslateService.translateToken === "" || TranslateService.translateUrl === "") {
            const api: {
                name: string,
                url: string,
                token: string
            } = await invoke('get_translate_api');
            TranslateService.translateToken = api.token;
            TranslateService.translateUrl = api.url;
        }

        const response: Response<{
            alternatives: string[],
            code: number,
            data: string,
            id: number,
            method: string,
            source_lang: string,
            target_lang: string
        }> = await client.post<{
            alternatives: string[],
            code: number,
            data: string,
            id: number,
            method: string,
            source_lang: string,
            target_lang: string
        }>(`${TranslateService.translateUrl}`, body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TranslateService.translateToken}`
            }
        });

        console.debug(body, response);


        if (response.status !== 200) {
            throw new Error(`翻译失败：${response.status}`);
        }
        try {
            return response.data.data as string;
        } catch (e) {
            return `翻译失败：${e}`;
        }
    }

    public static updateApi(url: string, token: string): void {
        TranslateService.translateUrl = url;
        TranslateService.translateToken = token;
    }
}