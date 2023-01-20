import { Device } from 'miot';
import { p2k, mp } from '../util';

/**
 * @type {string}
 */
const did = Device.deviceID;

// 使用jsdoc的方法实现typescript的as const
// https://github.com/Microsoft/TypeScript/issues/30445#issuecomment-1030284467
export const commands = /** @type {const} */ ({
  on: {
    did,
    prop: 'prop.2.1',
    siid: 2,
    piid: 1
  },
  fault: {
    did,
    prop: 'prop.2.2',
    siid: 2,
    piid: 2
  }
});

export const propToKey = p2k(commands);

export const miotProps = mp(commands);

export const miotPropArray = miotProps.map((item) => item.prop);

// 马上更新UI，然后下发指令
export const TYPE_SET_PROPS_UPDATE_BEFORE = 0;
// 先发下指令，回调后再更新UI
export const TYPE_SET_PROPS_UPDATE_AFTER = 1;
// 只下发指令，不更新UI
export const TYPE_SET_PROPS_NO_UPDATE = 2;