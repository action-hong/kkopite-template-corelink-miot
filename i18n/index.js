import { LocalizedStrings } from './localized';
import zh from './zh.json';
import en from './en.json';

// 为了代码提示
let o = zh;

o = new LocalizedStrings({
  en,
  zh
});

export function t(key, ...args) {
  if (args.length > 0) {
    return o.formatString(o[key], ...args);
  }
  return o[key];
}

export default o;
