/* eslint-disable no-useless-escape */
/* eslint-disable eqeqeq */
// 存储localStorage
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 获取localStorage
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

// 删除localStorage
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

// 获取样式
export const getStyle = (ele, attr, NumberMode = 'int') => {
  let target
  if (attr === 'scrollTop') {
    target = ele.scrollTop
  } else if (ele.currentStyle) {
    // 老版本ie的方法
    target = ele.currentStyle[attr]
  } else {
    // DOM2级样式
    target = document.defaultView.getComputedStyle(ele, null)[attr]
  }
  return NumberMode == 'float' ? parseFloat(target) : parseInt(target)
}

// 到达底部，加载更多 未被引用？
export const loadMore = (el, callback) => {
  let windowHeight = window.screen.height
  let height,
    setTop,
    paddingBottom,
    marginBottom,
    requestFram,
    oldScrollTop

  document.body.addEventListener('scroll', () => {
    loadMoreFun()
  }, false)

  // 运动开始时获取信息
  el.addEventListener('touchstart', () => {
    height = el.offsetHeight
    setTop = el.offsetTop
    paddingBottom = getStyle(el, 'paddingBottom')
    marginBottom = getStyle(el, 'marginBottom')
  }, {passive: true})

  // 运动过程中监听并判断是否是惯性运动,是否到达底部
  el.addEventListener('touchend', () => {
    oldScrollTop = document.body.scrollTop
    moveEnd()
  }, {passive: true})

  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (document.body.scrollTop != oldScrollTop) {
        oldScrollTop = document.body.scrollTop
        loadMoreFun()
        moveEnd()
      } else {
        cancelAnimationFrame(requestFram)
        height = el.offsetHeight
        loadMoreFun()
      }
    })
  }

  const loadMoreFun = () => {
    if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
      callback()
    }
  }
}

// 显示返回按钮
export const showBack = callback => {
  let requestFram
  let oldScrollTop
  let tagt = true
  let tagf = false

  document.addEventListener('scroll', () => {
    showBackFun()
  }, false)

  document.addEventListener('touchstart', () => {
    showBackFun()
  }, {passive: true})

  document.addEventListener('touchmove', () => {
    showBackFun()
  }, {passive: true})

  document.addEventListener('touchend', () => {
    showBackFun()
  }, {passive: true})

  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (document.body.scrollTop != oldScrollTop) {
        oldScrollTop = document.body.scrollTop
        moveEnd()
      } else {
        cancelAnimationFrame(requestFram)
      }
      showBackFun()
    })
  }

  const showBackFun = () => {
    if (document.body.scrollTop > 500) {
      callback(tagt)
    } else {
      callback(tagf)
    }
  }
}

// 运动效果
export const animate = (el, target, duration = 400, mode = 'ease-out', callback) => {
  clearInterval(el.timer)
  // 判断参数
  if (duration instanceof Function) {
    callback = duration
    duration = 400
  } else if (duration instanceof String) {
    mode = duration
    duration = 400
  }
  if (mode instanceof Function) {
    callback = mode
    mode = 'ease-out'
  }

  const attrStyle = attr => {
    if (attr === 'opacity') {
      return Math.round(getStyle(el, attr, 'float') * 100)
    } else {
      return getStyle(el, attr)
    }
  }
  // 获取根字体大小，作为换算rem的参考
  const rootSize = parseFloat(document.documentEl.style.fontSize)

  const unit = {}
  const initState = {}

  // 获取目标属性单位和初始样值
  Object.keys(target).forEach(attr => {
    if (/[^\d^\.]+/gi.test(target[attr])) {
      unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px'
    } else {
      unit[attr] = 'px'
    }
    initState[attr] = attrStyle(attr)
  })

  // 去掉传入的后缀单位
  Object.keys(target).forEach(attr => {
    if (unit[attr] == 'rem') {
      target[attr] = Math.ceil(parseInt(target[attr]) * rootSize)
    } else {
      target[attr] = parseInt(target[attr])
    }
  })
  let flag = true // 假设所有运动到达终点
  const remberSpeed = {}// 记录上一个速度值,在ease-in模式下需要用到
  el.timer = setInterval(() => {
    Object.keys(target).forEach(attr => {
      let iSpeed = 0 // 步长
      let status = false // 是否仍需运动
      let iCurrent = attrStyle(attr) || 0 // 当前元素属性址
      let speedBase = 0 // 目标点需要减去的基础值，三种运动状态的值都不同
      let intervalTime // 将目标值分为多少步执行，数值越大，步长越小，运动时间越长
      switch (mode) {
        case 'ease-out':
          speedBase = iCurrent
          intervalTime = duration * 5 / 400
          break
        case 'linear':
          speedBase = initState[attr]
          intervalTime = duration * 20 / 400
          break
        case 'ease-in':
          let oldspeed = remberSpeed[attr] || 0
          iSpeed = oldspeed + (target[attr] - initState[attr]) / duration
          remberSpeed[attr] = iSpeed
          break
        default:
          speedBase = iCurrent
          intervalTime = duration * 5 / 400
      }
      if (mode !== 'ease-in') {
        iSpeed = (target[attr] - speedBase) / intervalTime
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed)
      }
      // 判断是否达步长之内的误差距离，如果到达说明到达目标点
      switch (mode) {
        case 'ease-out':
          status = iCurrent != target[attr]
          break
        case 'linear':
          status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed)
          break
        case 'ease-in':
          status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed)
          break
        default:
          status = iCurrent != target[attr]
      }

      if (status) {
        flag = false
        // opacity 和 scrollTop 需要特殊处理
        if (attr === 'opacity') {
          el.style.filter = 'alpha(opacity:' + (iCurrent + iSpeed) + ')'
          el.style.opacity = (iCurrent + iSpeed) / 100
        } else if (attr === 'scrollTop') {
          el.scrollTop = iCurrent + iSpeed
        } else {
          el.style[attr] = iCurrent + iSpeed + 'px'
        }
      } else {
        flag = true
      }

      if (flag) {
        clearInterval(el.timer)
        if (callback) {
          callback()
        }
      }
    })
  }, 20)
}
