import { Service, Device, Host, Package } from 'miot'
import i18n from '../i18n'
export const showPrivacy = () => {
  if (!Device.isOwner) return
  const privacyURL = i18n.privacy
  var options = { privacyURL, hideAgreement: true, hideUserExperiencePlan: true }
  // options.hideAgreement = this.state.hideAgreement;
  Service.smarthome.batchGetDeviceDatas([{ did: Device.deviceID, props: ['prop.s_auth_config'] }]).then(res => {
    console.log('batchGetDeviceDatas ', res)
    let alreadyAuthed = false
    const result = res[Device.deviceID]
    let config
    if (result && result['prop.s_auth_config']) {
      config = result['prop.s_auth_config']
    }
    if (config) {
      try {
        const authJson = JSON.parse(config)
        console.log('auth config ', authJson)
        alreadyAuthed = authJson.privacyAuthed && true
      } catch (err) {
        // json解析失败，不处理
      }
    }
    if (alreadyAuthed) {
      // 已授权，不再弹窗显示
      console.log('已经授权')
      return Promise.resolve('已经授权')
    } else {
      return Host.ui.alertLegalInformationAuthorization(options).then(res => {
        console.log('授权结果', res)
        if (res) {
          return Service.smarthome.batchSetDeviceDatas([{ did: Device.deviceID, props: { 'prop.s_auth_config': JSON.stringify({ privacyAuthed: 'true' }) } }])
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject('取消授权')
        }
      })
    }
  }).catch(err => {
    // 没能授权成功
    console.log('授权错误' + err)
    Package.exit()
  })
}
