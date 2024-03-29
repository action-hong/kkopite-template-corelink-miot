/* eslint-disable react/prop-types */
import { Component } from 'react';
import { getPropertiesValue, addListener, subscribeMessages, setPropertiesValue } from '../api';
import { miotPropArray, miotProps, propToKey, TYPE_SET_PROPS_NO_UPDATE, TYPE_SET_PROPS_UPDATE_AFTER, TYPE_SET_PROPS_UPDATE_BEFORE } from '../constant';
import { IntervalTask, Task } from '../util';

export default class BasePage extends Component {
    state = {
      // 标志位表示当前正在执行某个操作, 确保回调结束后, 再执行下一个操作
      isOperating: true
    }

    sendTasks = {}

    lastState = {}

    // 消息队列
    sendQueue = []

    // 轮询
    readTask = new IntervalTask(3000);

    sendTasks = {}

    getReadProps() { return miotProps; }
    getRegisterProps() { return miotPropArray; }

    componentDidMount() {
      this.register();
      // 注意如果主界面的标题栏字体背景与其他界面不同的话, 切回主界面时需要以下代码去更新StatusBar
      // if (Platform.OS === 'android') {
      //   StatusBar.setTranslucent(true)
      // }
      // StatusBar.setBarStyle('light-content')
      // // 由于到通用界面, 状态栏是白底黑字
      // // 而主页上的状态栏是白字的, 因此要监听这个返回主页的事件, 更新下状态栏
      // // eslint-disable-next-line react/prop-types
      this.navigatorSubscription = this.props.navigation.addListener(
        'didFocus',
        () => {
          this.initData();
        }
      );
      // 如果再didFocus再做处理, 会明显看到状态栏的变化
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          // StatusBar.setBarStyle('light-content');
        }
      );
      this.loadProps();
    }

    componentWillUnmount() {
      this.unRegister();
      this.readTask.stop();
      this.navigatorSubscription && this.navigatorSubscription.remove();
      this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    handleLastState = () => {
      if (this.sendQueue.length === 0) return;
      const item = this.sendQueue.shift();
      this.handlePropertyChange(item, TYPE_SET_PROPS_NO_UPDATE);
    }

    loadProps = () => {
      this.readTask.start(() => {
        this.initData();
      });
    }

    // 初始化读取一些必要属性
    initData = () => {
      const params = this.getReadProps();
      const map = {};
      params.forEach((item) => {
        const key = propToKey[item.prop];
        map[key] = this.sendTasks[key].identify;
      });
      getPropertiesValue(params)
        .then((res) => {
          console.log('init', res);
          const obj = {};
          res.forEach((item, idx) => {
            const value = item.value;
            const key = propToKey[params[idx].prop];
            const task = this.sendTasks[key];
            if (task.sending || map[key] !== task.identify) {
              // console.log('==> 该属性刚设置过，暂不更新', key, value, task, map);
            } else if (item.code === 0) {
              obj[key] = value;
            }
          });
          this.setState(obj);
        }).catch((e) => {
          console.log(e);
        }).finally(() => {
          this.endOperator();
        });
    }

    // 监听一些事件
    register() {
      miotProps.forEach((item) => {
        this.sendTasks[item.key] = new Task(3000);
      });
      this.subcription = null;
      // 监听变化
      this.listener = addListener(
        (device, messages) => {
          if (this.props.navigation.isFocused()) {
            // console.log('Device received', messages);
            miotProps.forEach((item) => {
              if (messages.has(item.prop)) {
                const key = item.key;
                const value = messages.get(item.prop)[0];
                if (this.sendTasks[key].sending) {
                  // console.log('==> 该属性刚设置过，暂不更新', key, value);
                } else {
                  // console.log('received', messages)
                  this.setState({
                    [key]: value
                  });
                }
              }
            });
          }
        });

      subscribeMessages(
        ...this.getRegisterProps()
      ).then((subcription) => {
        console.log('subcription success');
        this.subcription = subcription;
      }).catch((e) => {
        console.log('subscription failed', e);
      });

      // 暂时使用轮询, android 手机无法监听
      // this.getDataId = setInterval(this.initData, 5000)
    }
    // 取消监听
    unRegister() {
      this.subcription && this.subcription.remove();
      this.listener && this.listener.remove();
      miotProps.forEach((item) => {
        this.sendTasks[item.key].stop();
      });
    }

    // 开始执行某个指令, 即所有相关操作都按不了了
    startOperator() {
      this.setState({
        isOperating: true
      });
    }

    // 结束执行
    endOperator() {
      this.setState({
        isOperating: false
      });
    }

    handlePropertyChange(params, updateType = TYPE_SET_PROPS_UPDATE_BEFORE) {
      if (!Array.isArray(params)) {
        params = [params];
      }

      const readyToUpdate = {};

      // 锁住这些改变的属性，不接收订阅
      params.forEach((item) => {
        const key = propToKey[item.prop];
        this.sendTasks[key].stop();
        this.sendTasks[key].sending = true;
        readyToUpdate[key] = item.value;
        item.oldValue = this.state[key];

        // 把发送队列中的相关item移除
        // 这里的params长度为1
        this.sendQueue = this.sendQueue.filter((item) => propToKey[item.prop] !== key);
      });

      if (updateType === TYPE_SET_PROPS_UPDATE_BEFORE) {
        this.setState(readyToUpdate);
      }

      if (this.state.isOperating) {
        // this.lastState = {
        //   ...this.lastState,
        //   ...readyToUpdate
        // };
        
        // 前面已经移除了重复的，所以没发送的直接添加进去
        this.sendQueue.push(...params);

        // console.log('==> 正在操作中, 不更新', readyToUpdate);
        return;
      }

      this.lastState = {};
      this.readTask.stop();
      this.startOperator();


      return setPropertiesValue(params)
        .then((res) => {
          res.forEach((item, idx) => {
            if (item.code === 0) {
              const key = propToKey[params[idx].prop];
              if (updateType === TYPE_SET_PROPS_UPDATE_AFTER) {
                this.setState({
                  [key]: params[idx].value
                });
              }
            }
          });
        }).finally(() => {
          this.endOperator();

          params.forEach((item) => {
            const key = propToKey[item.prop];
            // 开始计时，5后能够接收订阅
            this.sendTasks[key].start();
          });

          // 恢复订阅
          this.loadProps();

          // 尝试设置最后一次
          setTimeout(() => {
            this.handleLastState();
          }, 50);
        });
    }

    _getDisable() {
      return this.state.isOperating;
    }
}