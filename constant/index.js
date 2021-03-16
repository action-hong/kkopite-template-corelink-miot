import { Device } from 'miot'

const did = Device.deviceID

const commands = {
  on: {
    did,
    prop: 'prop.2.1',
    siid: 2,
    piid: 1
  }
}

export default commands

// prop => key
const propToKey = {}

Object.keys(commands).forEach((key) => {
  propToKey[commands[key].prop] = key
})

export { propToKey }

/**
 * @type { Array<{key: string, piid: number, siid: number, prop: string, did: string}> }
 */
export const miotProps = Object.keys(commands).map((key) => ({
  ...commands[key],
  key
}))

export const miotPropArray = miotProps.map((item) => item.prop)
