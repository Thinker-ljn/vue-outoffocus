const validate = (binding) => {
  if (typeof binding.value !== 'function') {
    console.warn('[Vue-outoffocus:] provided expression', binding.expression, 'is not a function.')
    return false
  }
  return true
}

const getObserverParams = function (el) {
  let options = {
    attributes: true,
    attributeFilter: ['style', 'tabindex']
  }
  let callback = function (mutationList, observer) {
    let oldDsp = observer.__oldDsp || ''
    let dsp = el.style.display
    let isDisplayed = dsp !== 'none' && oldDsp === 'none'
    observer.__oldDsp = dsp

    let tabindexMutation = mutationList.find(m => m.attributeName === 'tabindex')
    if (tabindexMutation || isDisplayed) {
      el.focus()
    }
  }

  return {options, callback}
}

export default {
  bind: function (el, binding) {
    if (!validate(binding)) return

    let cb = binding.value

    let {options, callback} = getObserverParams(el)
    let observer = new MutationObserver(callback)
    observer.observe(el, options)
    el.__observer__ = observer

    el.__vueOutOfFocusCb__ = (e) => {
      let activeEl = document.activeElement

      if (activeEl !== el && !el.contains(activeEl)) {
        setTimeout(cb, 0)
      }
    }

    el.setAttribute('tabindex', '-1')
    el.style.outline = 0

    el.addEventListener('blur', el.__vueOutOfFocusCb__, true)
  },
  unbind: function (el, binding) {
    el.removeEventListener('blur', el.__vueOutOfFocusCb__, true)
    delete el.__vueOutOfFocusCb__
    el.__observer__.disconnect()
    delete el.__observer__
  }
}
