import { Platform, StatusBar } from 'react-native';
import ratio from './ratio';
import { Styles } from 'miot/resources';

const styles = {
  headerStyle: {
  },
  blank: {
    height: 8,
    backgroundColor: Styles.common.backgroundColor,
    borderTopColor: Styles.common.hairlineColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Styles.common.hairlineColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
};

if (Platform.OS === 'ios') {
  styles.headerStyle = {
    borderBottomWidth: 0, // 修改的地方
    borderBottomColor: '#A7A7AA'
  };
} else {
  styles.headerStyle = {
    shadowColor: 'black',
    shadowOpacity: 0, // 修改的地方
    shadowRadius: 0,
    shadowOffset: {
      height: 0
    },
    elevation: 4,
    // https://www.crifan.com/react_navigation_bar_overlap_part_of_status_bar/
    // 标题栏会与顶部状态栏重叠, react-navigatio的bug, 已经修复了
    // 但是miot使用的raect-navigation 还是低版本
    // marginTop: StatusBar.currentHeight,
    height: 44 * ratio + StatusBar.currentHeight,
    paddingTop: StatusBar.currentHeight

  };
}

styles.headerStyle = {
  ...styles.headerStyle,
  // height: 44 * ratio,
  backgroundColor: '#F29517'
};

export default styles;
