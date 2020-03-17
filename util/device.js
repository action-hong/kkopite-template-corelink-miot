import { Service, DeviceEvent, Device } from 'miot'
import * as mock from '../mock'
// 提供接口

export const setPropertiesValue = (params) => {
  console.log('setProperties', params.map(({ prop, value }) => prop + ':' + value).join(','))
  // return Promise.resolve(true)
  return Service.spec.setPropertiesValue(params)
  // return mock.setPropertiesValue(params)
}
// export const setPropertiesValue = (params) => Promise.resolve(true)

export const getPropertiesValue = (params) => {
  return Service.spec.getPropertiesValue(params)
  // return mock.getPropertiesValue(params)
}

export const addListener = (callback) => {
  return DeviceEvent.deviceReceivedMessages.addListener(callback)
  // return mock.addListener(callback)
}

export const subscribeMessages = (...args) => {
  return Device.getDeviceWifi().subscribeMessages(...args)
  // return mock.subscribeMessages(args)
}

export const doAction = (params) => {
  console.log('send action', params)
  return Service.spec.doAction(params)
}
