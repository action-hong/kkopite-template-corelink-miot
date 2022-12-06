/* eslint-disable react/prop-types */
'use strict';

import NavigationBar from 'miot/ui/NavigationBar';
import React from 'react';
import { ScrollView, Image, View } from 'react-native';
import { t } from '../i18n';
import { dynamicStyleSheet } from 'miot/ui/Style';
import { COLOR } from '../theme';
import { vw } from '../ratio';
import { commands, miotProps } from '../constant';
import Text from '../component/AppText';
import { addListener, getPropertiesValue, subscribeMessages } from '../api';
export default class Setting extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const titleProps = {
      left: [
        {
          key: NavigationBar.ICON.BACK,
          onPress: () => navigation.goBack()
        }
      ],
      title: t('exceptionInformation') 
    };
    return {
      header: <NavigationBar {...titleProps} />
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      fault: 0
    };
  }

  componentDidMount() {
    const fault = this.props.navigation.getParam('fault', 0);
    this.setState({
      fault
    });
    this.register();
    this.navigatorSubscription = this.props.navigation.addListener(
      'didFocus',
      () => {
        this.initData();
      }
    );
  }

  componentWillUnmount() {
    this.unRegister();
    this.navigatorSubscription && this.navigatorSubscription.remove();
  }

  initData() {
    getPropertiesValue([
      commands.fault
    ]).then((res) => {
      const fault = res[0].value;

      this.setState({
        fault: fault !== undefined ? fault : 0
      });
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
              const key = item.key;
              const value = messages.get(item.prop)[0];
              if (value !== undefined) {
                this.setState({
                  [key]: value
                });
              }
            }
          });
        }
      });
  
    subscribeMessages(
      commands.fault.prop,
    ).then((subcription) => {
      console.log('subcription success');
      this.subcription = subcription;
    }).catch((e) => {
      console.log('subscription failed', e);
    });
  
  }
  // 取消监听
  unRegister() {
    this.subcription && this.subcription.remove();
    this.listener && this.listener.remove();
  }

  render() {
    const arr = [];

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {
          arr.map((error) => (
            <ErrorTip 
              key={error.message}
              text={error.message}
            />
          ))
        }
      </ScrollView>
    );
  }
}

function ErrorTip({
  text
}) {
  return (
    <View style={styles.infoContainer}>
      <Image 
        source={require('../assets/images/icon-info.png')}
        style={styles.infoImage} 
      />
      <Text>
        {text}
      </Text>
    </View>
  );
}

const styles = dynamicStyleSheet({
  container: {
    backgroundColor: COLOR.backgroundColor
  },
  contentContainer: {
    padding: vw(12),
    paddingBottom: vw(35),
    alignItems: 'center'
  },
  infoContainer: {
    paddingVertical: vw(11),
    paddingHorizontal: vw(16),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vw(9),
    backgroundColor: COLOR.cardBackgroundColor,
    borderRadius: vw(8)
  },
  infoImage: {
    width: vw(18.5),
    height: vw(19),
    marginRight: vw(12.5)
  }
});