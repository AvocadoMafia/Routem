

export async function translateJa2En(ja_text:string):Promise<string>{

  if(!ja_text || ja_text.trim() === "") return "";  

  try{
  const res = await fetch(process.env.LIBRETRANSLATE_URL!, {
  method: "POST",
  body: JSON.stringify({
    q: ja_text,
    source: "ja",
    target: "en",
  }),
  headers: { "Content-Type": "application/json" },
  });

  if(!res.ok){
    const data:{error:string} = await res.json();
    console.error(data.error, res.status);
    return ja_text;
  }

  const data = await res.json();
  const en_text:string = data.translatedText;

  return en_text;
  }catch(error){
    console.error(error);
    return ja_text;
  } 

}