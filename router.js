import MainPage from './page/MainPage'
import CommonSetting from './page/CommonSetting'
import { FirmwareUpgrade, MoreSetting } from 'miot/ui/CommonSetting'
import { createStackNavigator } from 'react-navigation'

export default createStackNavigator({
  Main: MainPage,
  MoreSetting,
  FirmwareUpgrade,
  CommonSetting
}, {
  initialRouteName: 'Main'
})
