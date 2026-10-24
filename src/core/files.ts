export async function readTextFile(file: File, max: number): Promise<string> {
  if(file.size > max) throw new Error(`Choose a file under ${max/(1024*1024)} MiB.`);
  // Preserve the UTF-8 BOM as part of the original file. The CSV parser handles it.
  return new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(await file.arrayBuffer());
}
