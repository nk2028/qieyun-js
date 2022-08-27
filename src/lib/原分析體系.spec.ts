import test_, { ExecutionContext } from 'ava';
// TODO v0.14 拆解
const test = test_.skip;

import 適配分析體系 from './原分析體系';
import { iter音韻地位 } from './解析資料';
import { 音韻地位 } from './音韻地位';

const from = (x: string) => 音韻地位.from描述(x);

function test適配(t: ExecutionContext, 適配: (地位: 音韻地位) => 音韻地位, 適配Strict?: (地位: 音韻地位) => 音韻地位) {
  return [
    (描述1: string, 描述2?: string) => {
      const 地位1 = from(描述1);
      const 地位2 = from(描述2 ?? 描述1);
      // 1. 地位1 -> 地位2
      t.is(適配(地位1).描述, 地位2.描述, 地位1.描述);
      if (!地位1.等於(地位2)) {
        // 2. 地位2 -> 地位2
        t.is(適配(地位2).描述, 地位2.描述, 地位2.描述);
        // 3. 驗證地位1
        適配Strict && t.throws(() => 適配Strict(地位1), undefined, 地位1.描述);
      }
    },
    (描述: string, msg?: string): void => void t.throws(() => 適配(from(描述)), msg ? { message: msg } : undefined),
  ] as const;
}

test('v2ext', t => {
  const [conv, reject] = test適配(t, 適配分析體系.v2ext, 適配分析體系('v2ext', { 嚴格: true }));
  const [conv開, reject開] = test適配(t, 適配分析體系.v2extFromPoem);

  t.throws(() => 適配分析體系('v2ext', { 嚴格: true, 原地位脣音寒歌默認開合: '開' }));

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
  conv('明合寒入', '明寒入'); // 末（韻典）
  conv('明開寒入'); // 䔾（韻典）
  conv開('明開寒入', '明寒入'); // 末（字音表）【注意該項與前項轉換前均為「明開寒入」但須作區分
  reject開('明合寒入'); // 字音表無該類地位
  // 清韻合口脣音（全字表「清B」）
  conv('幫開清入', '幫清入'); // 辟（韻典、字音表、全字表）
  conv('幫合清入', '幫B清入'); // 碧（全字表）

  // 重紐：重紐韻其他聲母
  conv('以合A脂平', '以合脂平'); // 唯（字音表、全字表）
  conv('生合B眞入', '生合眞入'); // 率（字音表）
  conv('生合A眞入', '生合眞入'); // 率（全字表）
  conv('知開B眞平', '知開眞平'); // 珍（字音表）
  conv('知合A眞入', '知合眞入'); // 珍（全字表）
  // 云母
  conv('云開眞平'); // 礥（Qieyun 0.12、韻典）
  conv('云開B眞平', '云開眞平'); // 礥（全字表）
  conv('云開A眞平', '匣開A眞平'); // 礥（字音表）

  // 重紐：清
  conv('清開A清平', '清開清平'); // 清（字音表）
  conv('知開B清平', '知開清平'); // 貞（字音表）
  conv('幫開A清入', '幫清入'); // 辟（字音表）
  conv('幫B清入'); // 碧（Qieyun 0.12）
  conv('幫三庚入'); // 碧（v2、韻典）
  //conv('幫合清入')； // 碧（全字表）（暫緩支持）

  // 重紐：其他
  conv('並A陽上'); // 𩦠（v2）
  reject('幫B陽上');
  reject('見開A陽上'); // 陽A暫僅限脣音
  conv('影開蒸入'); // 憶（全資料）抑（v2 以外）
  conv('影開B蒸入'); // 抑（v2）
  conv('影開A蒸入', '影開蒸入'); // 憶（unt_j）
  conv('幫開B蒸平', '幫蒸平'); // 冰（unt_j）
  conv('曉合B蒸入', '曉合蒸入'); // 洫（unt_j）
  conv('溪B幽平'); // 𠁫/恘（v2）
  conv('影A幽平', '影幽平'); // 幽（已知電子資料所無，但允許寫）
});

test('v2', t => {
  const [conv, reject] = test適配(t, 適配分析體系.v2, 適配分析體系.v2Strict);
  const [lenient] = test適配(t, 適配分析體系.v2lenient);

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
  conv('影開B蒸入');
  conv('溪B幽平');

  // 其他重紐
  reject('見開A之平');

  // 端知類隔
  conv('定合山平', '澄合山平');
  conv('定開佳上');
  conv('端開三麻平');
  conv('端開二庚上');
  conv('端幽平');

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
  conv('云開A眞平', '匣開A眞平');
  conv('云灰上', '云合廢上');
  reject('云合山平');
  lenient('云合山平');

  // 莊組臻攝開口
  conv('崇開臻上');
  conv('莊開欣上', '莊開臻上');
  conv('崇開眞上', '崇開臻上');
});

test('用內置資料測試適配分析體系', t => {
  for (const 地位 of iter音韻地位()) {
    t.is(適配分析體系.v2(地位).描述, 地位.描述);
    t.is(適配分析體系.v2ext(地位).描述, 地位.描述);
  }
});

function poemYtenxKyonhCommon(conv: (描述1: string, 描述2?: string) => void) {
  conv('幫凡入', '幫合凡入');

  // 呼：中立韻
  conv('疑魚平', '疑開魚平');
  conv('以尤平', '以開尤平');
  // 呼：脣音
  conv('幫先入', '幫開先入');
  conv('幫山入', '幫開山入');
  conv('明三庚平', '明開三庚平');
  conv('明元去', '明合元去');
  conv('幫魂上', '幫合魂上');
  conv('並三歌去', '並合三歌去');

  // 重紐：其他
  conv('並A陽上', '並合陽上');
  conv('影開B蒸入', '影開蒸入');
  conv('溪B幽平', '溪開幽平');

  // 類隔：蟹三平上
  conv('章開廢上', '章開咍上');
  conv('日開祭平', '日開齊平');
  // 類隔：齒音
  conv('以開寒入');
}

test('poem', t => {
  const [conv] = test適配(t, 適配分析體系('poem'), 適配分析體系('poem', { 嚴格: true }));

  poemYtenxKyonhCommon(conv);

  conv('定開脂去', '定開A脂去');

  // 呼：中立韻
  conv('幫三東平', '幫合三東平');
  conv('心冬去', '心合冬去');
  // 呼：灰咍嚴凡
  conv('並咍上', '並合灰上');

  // 重紐：重紐韻其他聲母
  conv('知合眞平', '知合B眞平');
  conv('云合眞平', '云合B眞平');
  conv('知合仙上', '知合B仙上');
  conv('來侵平', '來A侵平');
  // 重紐：清韻
  conv('明清平', '明開A清平');
  conv('知開清平', '知開B清平');
  conv('幫B清入', '幫開B清入');

  // 類隔
  // 端知
  conv('端開二庚上', '知開二庚上');
  conv('知合灰上', '端合灰上');
  // 齒音
  conv('清合夬去', '初合夬去');
  // 匣云
  conv('匣開A眞平', '云開A眞平');
  conv('云灰上', '匣灰上');
  // 莊組臻攝
  conv('莊開欣上');
});

function ytenxKyonhCommon(conv: (描述1: string, 描述2?: string) => void) {
  // 呼：中立韻
  conv('幫三東平', '幫開三東平');
  conv('心冬去', '心開冬去');
  // 呼：灰咍嚴凡
  conv('並咍上', '並開咍上');

  // 重紐：清韻
  conv('知開B清平', '知開清平');
  conv('幫開B清入', '幫開三庚入');

  // 類隔
  // 端知
  conv('端開二庚上');
  conv('知合灰上');
  // 齒音
  conv('清合夬去');
  // 匣云
  conv('云灰上');
  // 莊組臻攝
  conv('莊開欣上', '莊開臻上');
}

test('ytenx', t => {
  const [conv] = test適配(t, 適配分析體系('ytenx'), 適配分析體系('ytenx', { 嚴格: true }));

  poemYtenxKyonhCommon(conv);
  ytenxKyonhCommon(conv);

  conv('定開脂去', '定開脂去');

  // 重紐：重紐韻其他聲母
  conv('知合眞平');
  conv('云合眞平');
  conv('知合仙上', '知合仙上');
  conv('來侵平');
  // 重紐：清韻
  conv('明清平', '明開A清平');

  // 類隔：匣云
  conv('匣開A眞平', '云開眞平');
});

test('kyonh', t => {
  const [conv] = test適配(t, 適配分析體系('kyonh'), 適配分析體系('kyonh', { 嚴格: true }));

  poemYtenxKyonhCommon(conv);
  ytenxKyonhCommon(conv);

  conv('定開脂去', '定開A脂去');

  // 重紐：重紐韻其他聲母
  conv('知合眞平', '知合A眞平');
  conv('云合眞平', '云合B眞平');
  conv('知合仙上', '知合B仙上');
  conv('來侵平', '來A侵平');
  // 重紐：清韻
  conv('明清平', '明開清平');

  // 類隔：匣云
  conv('匣開A眞平', '云開B眞平');
});
