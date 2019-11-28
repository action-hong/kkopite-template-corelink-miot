import React from 'react'
import { Package } from 'miot'
import RootStack from './router'
import './custom'
class App extends React.Component {
  render () {
    return (
      <RootStack />
    )
  }
}
Package.entry(App, () => {

})
