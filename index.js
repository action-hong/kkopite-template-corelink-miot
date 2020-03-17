import React from 'react'
import { Package } from 'miot'
import RootStack from './router'
class App extends React.Component {
  render () {
    return (
      <RootStack />
    )
  }
}
Package.entry(App, () => {

})
