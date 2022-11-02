import { Device } from 'miot';

const did = Device.deviceID;

export const commands = {
  on: {
    did,
    prop: 'prop.2.1',
    siid: 2,
    piid: 1
  }
};

export const propToKey = Object.entries(commands)
  .map(([key, obj]) => ({ [obj.prop]: key }))
  .reduce((prev, cur) => ({
    ...prev,
    ...cur
  }), {});

/**
 * @type { Array<{key: string, piid: number, siid: number, prop: string, did: string}> }
 */
export const miotProps = Object.keys(commands).map((key) => ({
  ...commands[key],
  key
}));

export const miotPropArray = miotProps.map((item) => item.prop);

// 马上更新UI，然后下发指令
export const TYPE_SET_PROPS_UPDATE_BEFORE = 0;
// 先发下指令，回调后再更新UI
export const TYPE_SET_PROPS_UPDATE_AFTER = 1;
// 只下发指令，不更新UI
export const TYPE_SET_PROPS_NO_UPDATE = 2;