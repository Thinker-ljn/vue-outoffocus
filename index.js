const validate = (binding) => {
  if (typeof binding.value !== 'function') {
    console.warn('[Vue-outoffocus:] provided expression', binding.expression, 'is not a function.')
    return false
  }
  return true
}

export default {
  bind: function (el, binding) {
    if (!validate(binding)) return

    el.__vueOutOfFocusCb__ = (e) => {
      if (!el.contains(e.relatedTarget) && !el.contains(document.activeElement)) setTimeout(binding.value, 0)
    }

    el.setAttribute('tabindex', '-1')
    el.style.outline = 0

    el.addEventListener('blur', el.__vueOutOfFocusCb__, true)
  },
  unbind: function (el, binding) {
    el.removeEventListener('blur', el.__vueOutOfFocusCb__, true)
    delete el.__vueOutOfFocusCb__
  }
}
