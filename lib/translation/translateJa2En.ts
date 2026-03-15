
/**
 * @brief 日本語の文字列配列を英語の文字列配列に翻訳するAPI
 * @description 公式ref https://docs.libretranslate.com/api/operations/translate/ 軽量・無料・高速・open sourceといったメリットがある
 * @param ja_texts 翻訳したい日本語の文字列配列
 * @returns 翻訳後の英語の文字列配列。error時は元の日本語配列を返して処理を止めない
 */
export async function translateJa2En(ja_texts:string[]):Promise<string[]>{

  if(!ja_texts || ja_texts.length === 0) return [];  

  try{
  const res = await fetch(process.env.LIBRETRANSLATE_URL!, {
  method: "POST",
  body: JSON.stringify({
    q: ja_texts,
    source: "ja",
    target: "en",
  }),
  headers: { "Content-Type": "application/json" },
  });

  if(!res.ok){
    const data:{error:string} = await res.json();
    console.error(data.error, res.status);
    return ja_texts;
  }

  const data = await res.json();
  const en_text:string[] = data.translatedText;

  return en_text;
  }catch(error){
    console.error("translation API error", error);
    return ja_texts;
  } 

}