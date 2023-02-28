import { Host } from 'miot';
import { Platform } from 'react-native';

/**
 * iPhoneX 之类的手机底部有个SafeArea，该函数会返回该区域的高度，其他iPhone手机或android手机为0
 * @returns { number }
 */
export function getSafeAreaBottomHeight() {
  return Platform.OS === 'ios' && Host.isIphoneXSeries ? 34 : 0;
}