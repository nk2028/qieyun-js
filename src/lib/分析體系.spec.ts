import test, { ExecutionContext } from 'ava';

import 適配分析體系 from './分析體系';
import { iter音韻地位, 音韻地位 } from './音韻地位';

const from = (x: string) => 音韻地位.from描述(x);

function test適配(t: ExecutionContext, 適配: (地位: 音韻地位) => 音韻地位, 適配Strict?: (地位: 音韻地位) => 音韻地位) {
  return [
    (描述1: string, 描述2?: string) => {
      const 地位1 = from(描述1);
      const 地位2 = from(描述2 ?? 描述1);
      t.is(適配(地位1).描述, 地位2.描述, 地位1.描述);
      if (適配Strict && !地位1.等於(地位2)) {
        t.throws(() => 適配Strict(地位1), undefined, 地位1.描述);
      }
    },
    (描述: string, msg?: string) => void t.throws(() => 適配(from(描述)), msg ? { message: msg } : undefined),
  ];
}

test('v2ext', t => {
  const [conv, reject] = test適配(t, 適配分析體系.v2ext, 適配分析體系({ 體系: 'v2ext', 嚴格: true }));
  const [conv合] = test適配(t, 適配分析體系.v2extFromYtenx);
  const [conv開, reject開] = test適配(t, 適配分析體系.v2extFromPoem);

  conv('幫凡入'); // 法
  conv('定開脂去'); // 地

  // 呼：指定開合韻
  reject('見開文平');
  reject('見合欣平');
  reject('幫開凡入'); // 脣音正則化之前亦會先檢查呼與韻搭配
  reject('幫合嚴入');

  // 呼：中立韻、脣音
  conv('端開冬平', '端冬平'); // 冬（韻典）
  conv('端合冬平', '端冬平'); // 冬（字音表）
  conv('疑合虞平', '疑虞平'); // 虞（韻典、字音表）
  conv('幫合三東平', '幫三東平'); // 風（字音表）
  // 脣音寒歌韻
  reject('明合寒入'); // 不指定轉換前體系時不可處理
  reject('明開寒入');
  conv合('明合寒入', '明寒入'); // 末（韻典）
  conv合('明開寒入'); // 䔾（韻典）
  conv開('明開寒入', '明寒入'); // 末（字音表）【注意該項與前項轉換前均為「明開寒入」但須作區分
  reject開('明合寒入'); // 字音表無該類地位

  // 重紐：重紐韻其他聲母
  conv('以合A脂平', '以合脂平'); // 唯（字音表、全字表）
  conv('生合B眞入', '生合眞入'); // 率（字音表）
  conv('生合A眞入', '生合眞入'); // 率（全字表）
  conv('知開B眞平', '知開眞平'); // 珍（字音表）
  conv('知合A眞入', '知合眞入'); // 珍（全字表）
  // 云母
  conv('云開眞平'); // 礥（v1、韻典）
  conv('云開B眞平', '云開眞平'); // 礥（全字表）
  conv('云開A眞平', '匣開A眞平'); // 礥（字音表）

  // 重紐：清
  conv('清開A清平', '清開清平'); // 清（字音表）
  conv('知開B清平', '知開清平'); // 貞（字音表）
  conv('幫開A清入', '幫清入'); // 辟（字音表）
  conv('幫B清入'); // 碧（v1）
  conv('幫三庚入'); // 碧（v2、韻典）

  // 重紐：其他
  conv('溪B幽平'); // 𠁫/恘（v2）
  conv('影A幽平', '影幽平'); // 幽（已知電子資料所無，但允許寫）
  conv('並A陽上'); // 𩦠（v2）
  reject('幫B陽上');
  reject('見開A陽上'); // 陽A暫僅限脣音
  conv('影開蒸入'); // 憶（全資料）抑（v2 以外）
  conv('影開B蒸入'); // 抑（v2）
  reject('影開A蒸入');
});

test('v2', t => {
  const [conv, reject] = test適配(t, 適配分析體系.v2, 適配分析體系.v2Strict);
  const [lenient] = test適配(t, 適配分析體系.v2Lenient);

  conv('幫凡入');
  conv('定開脂去');

  // 中立韻、脣音呼
  conv('端開冬平', '端冬平');
  conv('端合冬平', '端冬平');
  conv('疑合虞平', '疑虞平');
  conv('幫合三東平', '幫三東平');

  // 灰咍嚴凡
  conv('並咍上', '並灰上');
  conv('並開咍上', '並灰上');
  conv('明嚴去', '明凡去');
  conv('見凡去', '見嚴去');

  // 重紐八韻非鈍音
  conv('章開A仙平', '章開仙平');
  conv('俟開B脂上', '俟開脂上');

  // 清
  conv('幫開A清入', '幫清入');
  conv('幫合B清入', '幫三庚入');

  // 陽蒸幽
  conv('並三A陽上');
  conv('溪B幽平');
  conv('影A幽平', '影幽平');
  reject('並三B陽上');
  reject('見開A蒸平');

  // 其他重紐
  reject('見開A之平');

  // 端知類隔
  conv('端開二庚上', '端開二庚上');
  conv('定合山平', '澄合山平');

  // 蟹三平上
  conv('昌咍上', '昌開廢上');

  // 齒音
  conv('昌開山平', '初開山平');
  reject('以開寒入');
  lenient('以開寒入');
  conv('清合夬去', '初合夬去');
  reject('崇開先平');
  lenient('崇開先平');

  // 云匣
  conv('匣開A眞平');
  conv('云開A眞平', '匣開A眞平');
  conv('云灰上', '云合廢上');
  reject('云合山平');
  lenient('云合山平');

  // 莊組臻攝開口
  conv('崇開臻上');
  conv('莊開欣上');
});

test('v1', t => {
  for (const 地位 of iter音韻地位()) {
    t.is(適配分析體系.v1(地位).描述, 地位.描述);
    let 地位2;
    try {
      地位2 = 適配分析體系.v1(適配分析體系.v2Lenient(地位));
      if (!地位.屬於`二等 (章組 或 日母) 或 清韻 重紐B類`) {
        t.true(地位.等於(地位2), `${地位.描述} -> ${地位2.描述}`);
      }
    } catch (e) {
      t.fail(`${地位.描述} ${e}`);
    }
  }
});
