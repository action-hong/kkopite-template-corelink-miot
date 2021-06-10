/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Text, Platform
} from 'react-native';

export default class AppText extends Component {
  render() {
    const propsStyle = this.props.style;
    let style = [Platform.select({
      ios: {},
      android: {
        fontFamily: 'Kmedium'
      }
    })];
    if (propsStyle) {
      if (Array.isArray(propsStyle)) {
        style = style.concat(propsStyle);
      } else {
        style.push(propsStyle);
      }
    }
    return (
      <Text {...this.props} style={style} allowFontScaling={false}>
        {this.props.children}
      </Text>
    );
  }
}
