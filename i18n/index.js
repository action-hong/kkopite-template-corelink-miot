import LocalizedStrings from '../util/LocalizedStrings'
import zh from './zh'
import en from './en'
import ko from './ko'
import zhTW from './zh-tw'
import zhHK from './zh-hk'

export default new LocalizedStrings({
  en,
  zh,
  ko,
  'zh-tw': zhTW,
  'zh-hk': zhHK
})
