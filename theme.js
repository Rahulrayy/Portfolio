// Light / dark theme.
// Loaded as a blocking script in <head> so a saved choice is applied
// before first paint (no flash of the wrong theme). With no saved
// choice, data-theme stays unset and style.css follows the OS setting.
(function () {
  var KEY = 'theme'
  var root = document.documentElement
  var mq = window.matchMedia('(prefers-color-scheme: dark)')

  // Storage can throw (private mode, blocked site data); the theme
  // still works, it just isn't remembered.
  function saved() {
    try { var v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null } catch (e) { return null }
  }
  function current() { return root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light') }

  var s = saved()
  if (s) root.setAttribute('data-theme', s)

  var ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor"/></svg>'

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.querySelector('.nav-links')
    if (!list) return
    var li = document.createElement('li')
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'theme-toggle'

    function render() {
      var next = current() === 'dark' ? 'light' : 'dark'
      btn.innerHTML = ICON + '<span>' + (next === 'dark' ? 'Dark' : 'Light') + '</span>'
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme')
    }

    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark'
      root.setAttribute('data-theme', next)
      try { localStorage.setItem(KEY, next) } catch (e) {}
      render()
    })
    // Keep the label right if the OS theme flips while no choice is saved.
    if (mq.addEventListener) mq.addEventListener('change', function () { if (!saved()) render() })

    li.appendChild(btn)
    list.appendChild(li)
    render()
  })
})()
