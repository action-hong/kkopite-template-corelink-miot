import command from '../constant';

// 该模块用来mock与硬件的交互, 从而可以无需真实设备即可完成虚拟的联调开发

// 存储上一次的数据, 方便比较 看是否需要通知
const oldObj = {};
// 临时存储数据
const obj = {};

let timer = null;

const startListen = () => {
  if (timer) return;
  timer = setInterval(() => {
    for (const key in obj) {
      const val = obj[key];
      const oldVal = oldObj[key];
      if (val !== oldVal) {
        // 记下来, 下次不改变就不用再发了
        oldObj[key] = val;
        const map = new Map();
        map.set(key, [val]);
        listener.forEach((func) => {
          func(null, map);
        });
      }
    }
  }, 3000);
};

const stopListen = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

for (const key in command) {
  // eslint-disable-next-line no-prototype-builtins
  if (command.hasOwnProperty(key)) {
    const item = command[key];
    obj[item.prop] = 0;
  }
}

// 手动添加 默认值
// obj['prop.2.1'] = true

// 监听
const listener = new Set();

export const doAction = () => {
  return Promise.resolve(true);
};

/**
 * @param {Array<{prop: string}>} items
 */
export const getPropertiesValue = async(items) => {
  return items.map(({ prop }) => {
    return {
      value: obj[prop]
    };
  });
};

/**
 * @param {Array<{value: any, prop: string}>} items
 */
export const setPropertiesValue = async(items) => {
  items.forEach((item) => {
    obj[item.prop] = item.value;
  });
};

export const addListener = (func) => {
  startListen();
  listener.add(func);
  return {
    remove() {
      listener.delete(func);
      if (listener.size === 0) {
        stopListen();
      }
    }
  };
};

// 对于mock来说, 这个方法就没什么意义了
export const subscribeMessages = async() => {
  return {
    remove() {}
  };
};

// eslint-disable-next-line no-undef
GLOBAL.mockObj = obj;
