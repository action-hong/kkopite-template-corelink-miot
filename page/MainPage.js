/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import ratio from '../ratio';
import NavigationBar from 'miot/ui/NavigationBar';
import Text from '../component/AppText';
import { Package, Device, PackageEvent } from 'miot';
import { showPrivacy } from '../util/privacy';
import i18n from '../i18n';
import { getPropertiesValue, addListener, subscribeMessages, setPropertiesValue } from '../util/device';
import commands, { miotPropArray, miotProps, propToKey } from '../constant';

export default class MainPage extends Component {
  static navigationOptions = ({ navigation }) => {
    const titleProps = {
      left: [
        {
          key: NavigationBar.ICON.BACK,
          onPress: () => Package.exit()
        }
      ],
      right: [
        {
          key: NavigationBar.ICON.MORE,
          onPress: () => navigation.navigate('CommonSetting')
        }
      ],
      title: Device.name,
      type: NavigationBar.TYPE.DARK
    };
    return {
      header: <NavigationBar {...titleProps} />
    };
  }

    state = {
      // 标志位表示当前正在执行某个操作, 确保回调结束后, 再执行下一个操作
      isOperating: true
    }

    componentDidMount() {
      showPrivacy();
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
          StatusBar.setBarStyle('light-content');
        }
      );
    }

    componentWillUnmount() {
      this.unRegister();
      this.navigatorSubscription && this.navigatorSubscription.remove();
      this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    // 初始化读取一些必要属性
    initData = () => {
      showPrivacy();
      getPropertiesValue(miotProps)
        .then((res) => {
          console.log('init', res);
          const obj = {};
          res.forEach((item, idx) => {
            const value = item.value;
            obj[miotProps[idx].key] = value;
          });
        }).catch((e) => {
          console.log(e);
        }).finally(() => {
          this.endOperator();
        });
    }

    // 监听一些事件
    register() {
      this.subcription = null;
      // 监听变化
      this.listener = addListener(
        (device, messages) => {
          if (this.props.navigation.isFocused()) {
            console.log('Device received', messages);
            miotProps.forEach((item) => {
              if (messages.has(item.prop)) {
                // console.log('received', messages)
                this.setState({
                  [item.key]: messages.get(item.prop)[0]
                });
              }
            });
          }
        });

      subscribeMessages(
        ...miotPropArray
      ).then((subcription) => {
        console.log('subcription success');
        this.subcription = subcription;
      }).catch((e) => {
        console.log('subscription failed', e);
      });

      // 暂时使用轮询, android 手机无法监听
      // this.getDataId = setInterval(this.initData, 5000)

      // 监听撤销授权事件, 退出插件
      this.authorizationCancelSubscription = PackageEvent.packageAuthorizationCancel.addListener(() => {
        Package.exit();
      });
    }

    // 取消监听
    unRegister() {
      this.subcription && this.subcription.remove();
      this.listener && this.listener.remove();
      this.authorizationCancelSubscription && this.authorizationCancelSubscription.remove();
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

    handlePropertyChange(params) {
      this.startOperator();
      if (!Array.isArray(params)) {
        params = [params];
      }
      return setPropertiesValue(params)
        .then((res) => {
          res.forEach((item, idx) => {
            if (item.code === 0) {
              this.setState({
                [propToKey[params[idx].prop]]: params[idx].value
              });
            }
          });
        }).finally(() => {
          this.endOperator();
        });
    }

    render() {
      return (
        <View style={styles.container}>
          <Text>{i18n.hello}</Text>
        </View>
      );
    }

    _getDisable() {
      return this.state.isOperating;
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: '#F29517'
  },
  hello: {
    width: 100 * ratio,
    textAlign: 'center'
  }
});
