(function (doc, win) {
  // eslint-disable-next-line one-var
  var docEl = doc.documentElement,
    // 旋转或变换屏幕
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      // 配置字体大小
      docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
    }
  if (!doc.addEventListener) return
  // 监听
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
