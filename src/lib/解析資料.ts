import 資料 from './資料';

export const m字頭2音韻編碼解釋 = new Map<string, Array<{ 編碼: string; 解釋: string }>>();
export const m音韻編碼2字頭解釋 = new Map<string, Array<{ 字頭: string; 解釋: string }>>();
export const m音韻編碼2反切 = new Map<string, string>();

(function 解析資料() {
  const patternOuter = /([A-Za-z0-9]{3})(..)([^A-Za-z0-9]+)/gu;
  let matchOuter: RegExpExecArray;
  while ((matchOuter = patternOuter.exec(資料)) != null) {
    const [, 編碼, 反切, 條目] = matchOuter;

    if (反切 !== '@@') {
      // '@@' is a placeholder in the original data to indicate that there is no 反切
      m音韻編碼2反切.set(編碼, 反切);
    }

    const patternInner = /([^|])([^|]*)/gu;
    let matchInner: RegExpExecArray;
    while ((matchInner = patternInner.exec(條目)) != null) {
      const [, 字頭, 解釋] = matchInner;

      if (!m字頭2音韻編碼解釋.has(字頭)) {
        m字頭2音韻編碼解釋.set(字頭, []); // set default value
      }
      m字頭2音韻編碼解釋.get(字頭).push({ 編碼, 解釋 });

      if (!m音韻編碼2字頭解釋.has(編碼)) {
        m音韻編碼2字頭解釋.set(編碼, []); // set default value
      }
      m音韻編碼2字頭解釋.get(編碼).push({ 字頭, 解釋 });
    }
  }
})();
