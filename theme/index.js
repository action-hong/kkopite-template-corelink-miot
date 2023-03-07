import { dynamicColor } from 'miot/ui/Style/DynamicColor';
import { vw } from '../ratio';
import { dynamicStyleSheet } from 'miot/ui/Style/DynamicStyleSheet';

import { DarkMode } from 'miot';

export const isDark = DarkMode.getColorScheme() === 'dark';

export const primaryColor = 'xm#00D0FD';

export const COLOR = {
  primaryColor: 'xm#00D0FD',
  backgroundColor: dynamicColor('#f4f5fa', '#262626'),
  cardBackgroundColor: dynamicColor('#ffffff', '#161616'),
  titleColor: '#000000',
  subTitleColor: dynamicColor('#8A8A8A', '#c6c6c6'),
  lineColor: 'xm#e8e8e8'
};

export const globalStyles = dynamicStyleSheet({
  title: {
    color: COLOR.titleColor,
    fontSize: vw(15),
    fontWeight: 'bold',
    marginBottom: vw(7)
  },
  subTitle: {
    color: COLOR.subTitleColor,
    fontSize: vw(12)
  }
});
