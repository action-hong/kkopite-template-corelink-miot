import { Service, DeviceEvent, Device } from 'miot'
import * as mock from '../mock'
// 提供接口

const USE_MOCK = {{mock}}

export const setPropertiesValue = (params) => {
  console.log('setProperties', params.map(({ prop, value }) => prop + ':' + value).join(','))
  if (USE_MOCK) return mock.setPropertiesValue(params)
  return Service.spec.setPropertiesValue(params)
}
// export const setPropertiesValue = (params) => Promise.resolve(true)

export const getPropertiesValue = (params) => {
  if (USE_MOCK) return mock.getPropertiesValue(params)
  return Service.spec.getPropertiesValue(params)
}

export const addListener = (callback) => {
  if (USE_MOCK) return mock.addListener(callback)
  return DeviceEvent.deviceReceivedMessages.addListener(callback)
}

export const subscribeMessages = (...args) => {
  if (USE_MOCK) return mock.subscribeMessages(args)
  return Device.getDeviceWifi().subscribeMessages(...args)
}

export const doAction = (params) => {
  console.log('send action', params)
  return Service.spec.doAction(params)
}
