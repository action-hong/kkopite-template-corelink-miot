import { Service, DeviceEvent, Device } from 'miot';
import * as mock from '../mock';
import Toast from 'react-native-root-toast';
import i18n from '../i18n';
// 提供接口

const USE_MOCK = false;

export const setPropertiesValue = (params) => {
  console.log('setProperties', params.map(({ prop, value }) => `${ prop }:${ value }`).join(','));
  if (USE_MOCK) return mock.setPropertiesValue(params);
  return Service.spec.setPropertiesValue(params)
    .then((res) => {
      console.log('set properties success', res);
      const message = res.filter((item) => item.code !== 0)
        .map((item) => generateMessage(item.code))
        .join(',');

      if (message) {
        Toast.show(message, {
          position: Toast.positions.CENTER
        });
      }
      return res;
    }).catch((e) => {
      console.log('set properties failed', e);
      Toast.show(i18n.error_network, {
        position: Toast.positions.CENTER
      });
      return Promise.reject(e);
    });
};
export const getPropertiesValue = (params) => {
  if (USE_MOCK) return mock.getPropertiesValue(params);
  return Service.spec.getPropertiesValue(params)
    .catch((e) => {
      console.log('get properties failed', e);
      Toast.show(i18n.error_network, {
        position: Toast.positions.CENTER
      });
      return Promise.reject(e);
    });
};

export const addListener = (callback) => {
  if (USE_MOCK) return mock.addListener(callback);
  return DeviceEvent.deviceReceivedMessages.addListener(callback);
};

export const subscribeMessages = (...args) => {
  if (USE_MOCK) return mock.subscribeMessages(args);
  return Device.getDeviceWifi().subscribeMessages(...args);
};

export const doAction = (params) => {
  console.log('send action', params);
  if (USE_MOCK) return mock.doAction(params);
  return Service.spec.doAction(params).then((res) => {
    console.log('action success', res);

    if (res.code !== 0) {
      Toast.show(generateMessage(res.code), {
        position: Toast.positions.CENTER
      });
    }

    return res;
  }).catch((e) => {
    console.log('action failed', e);
    Toast.show(i18n.error_network, {
      position: Toast.positions.CENTER
    });
    return Promise.reject(e);
  });
};

const generateMessage = (code) => {
  code = `${ code }`;
  const error = code.slice(code.length - 3);
  return i18n[error] || i18n.code_error;
};
