import LocalizedStrings from '../util/LocalizedStrings'
import zh from './zh'
import en from './en'
import ko from './ko'
import zhTW from './zh-tw'
import zhHK from './zh-hk'

// 为了代码提示
let o = zh

o = new LocalizedStrings({
  en,
  zh,
  ko,
  'zh-tw': zhTW,
  'zh-hk': zhHK
})

export default o
