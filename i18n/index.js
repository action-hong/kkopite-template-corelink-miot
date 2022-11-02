import LocalizedStrings from './localized';
import zh from './zh.json';
import en from './en.json';
import ko from './ko.json';
import zhTW from './zh-tw.json';
import zhHK from './zh-hk.json';

// 为了代码提示
let o = zh;

o = new LocalizedStrings({
  en,
  zh,
  ko,
  'zh-tw': zhTW,
  'zh-hk': zhHK
});

export function t(key) {
  return o[key];
}

export default o;
