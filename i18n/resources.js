// 该文件用来定义所有需要require资源国际化
// 因为i8n-ally无法处理这些内容
import LocalizedStrings from '../util/LocalizedStrings';

const zh = {
  agreement: require('../resources/raw/agreement-zh.html'),
  privacy: require('../resources/raw/privacy-zh.html')
};

const en = {
  agreement: require('../resources/raw/agreement.html'),
  privacy: require('../resources/raw/privacy.html')
};

let o = zh;

o = new LocalizedStrings({
  zh,
  en
});

export default o;