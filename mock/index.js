import command from '../constant'

// 该模块用来mock与硬件的交互, 从而可以无需真实设备即可完成虚拟的联调开发

// 临时存储数据
let obj = {}

for (const key in command) {
  // eslint-disable-next-line no-prototype-builtins
  if (command.hasOwnProperty(key)) {
    const item = command[key]
    obj[item.prop] = 0
  }
}

// 添加默认值
// obj['prop.2.1'] = true

// 监听
const listener = new Set()

obj = new Proxy(obj, {
  set (target, key, value, receiver) {
    // 广播
    listener.forEach(func => {
      const map = new Map()
      map.set(key, [value])
      func(null, map)
    })
    return Reflect.set(target, key, value)
  },
  get (target, key, receiver) {
    return Reflect.get(target, key)
  }
})

/**
 * @param {Array<{prop: string}>} items
 */
export const getPropertiesValue = async (items) => {
  return items.map(({ prop }) => {
    return {
      value: obj[prop]
    }
  })
}

/**
 * @param {Array<{value: any, prop: string}>} items
 */
export const setPropertiesValue = async (items) => {
  items.forEach(item => {
    obj[item.prop] = item.value
  })
}

export const addListener = (func) => {
  listener.add(func)
  return {
    remove () {
      listener.delete(func)
    }
  }
}

// 对于mock来说, 这个方法就没什么意义了
export const subscribeMessages = async () => {
  return {
    remove () {}
  }
}

// eslint-disable-next-line no-undef
GLOBAL.mockObj = obj