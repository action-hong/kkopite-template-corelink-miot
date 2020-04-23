## 为何不适用`withNavigationFocus`

如果使用了`withNavigationFocus`, 从A页面到B页面时, 会先到用render B, 然后再render A一次, 这样如果两个页面的状态栏样式不一致, 就会造成B页面显示A页面的状态栏样式,导致ui出现问题