
/**
 * @brief 日本語の文字列配列を英語の文字列配列に翻訳するAPI
 * @description 公式ref https://docs.libretranslate.com/api/operations/translate/ 軽量・無料・高速・open sourceといったメリットがある
 * @param ja_texts 翻訳したい日本語の文字列配列
 * @returns 翻訳後の英語の文字列配列。error時は元の日本語配列を返して処理を止めない
 */
export async function translateJa2En(ja_texts:string[]):Promise<string[]>{

  if(!ja_texts || ja_texts.length === 0) return [];  

  try{
  const url = process.env.LIBRETRANSLATE_URL!;
  const translateUrl = url.endsWith('/') ? `${url}translate` : `${url}/translate`;
  const res = await fetch(translateUrl, {
  method: "POST",
  body: JSON.stringify({
    q: ja_texts,
    source: "ja",
    target: "en",
  }),
  headers: { "Content-Type": "application/json" },
  });

  if(!res.ok){
    let errorMsg = `HTTP error! status: ${res.status}`;
    try {
      const data = await res.json();
      errorMsg = data.error || errorMsg;
    } catch (e) {
      // Not JSON, ignore
    }
    console.error("Translation API error:", errorMsg);
    return ja_texts;
  }

  try {
    const data = await res.json();
    const en_text:string[] = data.translatedText;
    if (!en_text || !Array.isArray(en_text)) {
        throw new Error("Invalid response format: translatedText is missing or not an array");
    }
    return en_text;
  } catch (e) {
    console.error("Failed to parse translation API response:", e);
    return ja_texts;
  }
  }catch(error){
    console.error("translation API error", error);
    return ja_texts;
  } 

}