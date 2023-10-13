/* eslint-disable react/prop-types */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { vw } from '../ratio';
import NavigationBar from 'miot/ui/NavigationBar';
import Text from '../component/AppText';
import { Package, Device, PackageEvent } from 'miot';
import { t } from '../i18n';
import BasePage from './BasePage';

export default class MainPage extends BasePage {
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
      title: Device.name
      // type: NavigationBar.TYPE.DARK
    };
    return {
      header: <NavigationBar {...titleProps} />
    };
  }

    state = {
      // 标志位表示当前正在执行某个操作, 确保回调结束后, 再执行下一个操作
      isOperating: false,
    }

    // 监听一些事件
    register() {
      super.register();

      // 监听撤销授权事件, 退出插件
      this.authorizationCancelSubscription = PackageEvent.packageAuthorizationCancel.addListener(() => {
        Package.exit();
      });
    }
    // 取消监听
    unRegister() {
      super.unRegister();
      this.authorizationCancelSubscription && this.authorizationCancelSubscription.remove();
    }

    render() {
      return (
        <View style={styles.container}>
          <Text>{ t('hello') }</Text>
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
    width: vw(100),
    textAlign: 'center'
  }
});
