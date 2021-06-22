/* eslint-disable react/prop-types */
'use strict';

import { strings, Styles } from 'miot/resources';
import { CommonSetting } from 'miot/ui/CommonSetting';
import { firstAllOptions } from 'miot/ui/CommonSetting/CommonSetting';
import Separator from 'miot/ui/Separator';
import NavigationBar from 'miot/ui/NavigationBar';
import { Device, PackageEvent, Service } from 'miot';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import resources from '../i18n/resources';

export default class Setting extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const titleProps = {
      left: [
        {
          key: NavigationBar.ICON.BACK,
          onPress: () => navigation.goBack()
        }
      ],
      title: strings.setting
    };
    return {
      header: <NavigationBar {...titleProps} />
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      showDot: []
    };
  }

  render() {
    const firstOptions = [
      firstAllOptions.SHARE,
      firstAllOptions.FIRMWARE_UPGRADE,
      firstAllOptions.IFTTT
    ];

    // 显示固件升级二级菜单
    const extraOptions = {
      showUpgrade: true,
      deleteDeviceMessage: '',
      option: {
        privacyURL: resources.privacy,
        hideAgreement: true,
        experiencePlanURL: '',
        hideUserExperiencePlan: true
      }
    };
    return (
      <View style={styles.container}>
        <Separator />
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={[styles.blank, { borderTopWidth: 0 }]} />
          <CommonSetting
            navigation={this.props.navigation}
            firstOptions={firstOptions}
            showDot={this.state.showDot}
            extraOptions={extraOptions}
          />
          <View style={[{ height: 20 }]} />
        </ScrollView>
      </View>
    );
  }

  componentDidMount() {
    this.checkDeviceVersion();
    // 升级界面返回来, 再去检查下固件升级 来去掉小红点
    this.nativeBack = PackageEvent.packageViewWillAppear.addListener(() => {
      this.checkDeviceVersion();
    });
  }

  componentWillUnmount() {
    this.nativeBack && this.nativeBack.remove();
  }

  checkDeviceVersion() {
    Service.smarthome.checkDeviceVersion(Device.deviceID, Device.type)
      .then((res) => {
        const showDot = res.hasNewFirmware ? [firstAllOptions.FIRMWARE_UPGRADE] : [];
        this.setState({
          showDot
        });
      }).catch((e) => {
        console.log(e);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Styles.common.backgroundColor,
    flex: 1
  },
  blank: {
    height: 8,
    backgroundColor: Styles.common.backgroundColor,
    borderTopColor: Styles.common.hairlineColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Styles.common.hairlineColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});
