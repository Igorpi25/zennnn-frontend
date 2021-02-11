module.exports = {
  lang: 'en-US',
  title: 'ZENNNN UI',
  description: 'ZENNNN ui components.',

  themeConfig: {
    sidebar: getSidebar(),
  },
}

function getSidebar () {
  return [
    {
      text: 'Styles',
      children: [
        { text: 'Typography', link: '/styles/typography' },
      ]
    },
    {
      text: 'Components',
      children: [
        { text: 'Alerts', link: '/components/alerts' },
        { text: 'Buttons', link: '/components/buttons' },
        { text: 'Button Groups', link: '/components/button-groups' },
        { text: 'Icons', link: '/components/icons' },
        { text: 'Images', link: '/components/images' },
        { text: 'Loading', link: '/components/loading' },
        { text: 'Menus', link: '/components/menus' },
        { text: 'Modals', link: '/components/modals' },
        { text: 'Progress', link: '/components/progress' },
        { text: 'Tooltips', link: '/components/tooltips' },
        { text: 'Windows', link: '/components/windows' },
        { text: 'Transitions', link: '/components/transitions' },
      ],
    },
    {
      text: 'Api',
      children: [
        { text: 'Alert', link: '/api/alert' },
        { text: 'Btn', link: '/api/btn', activeMatch: '/api/btn$' },
        { text: 'BtnToggle', link: '/api/btn-toggle' },
        { text: 'Icon', link: '/api/icon' },
        { text: 'Image', link: '/api/image' },
        { text: 'Loading Spinner', link: '/api/loading-spinner' },
        { text: 'Menu', link: '/api/menu', activeMatch: '/api/menu$' },
        { text: 'MenuItem', link: '/api/menu-item' },
        { text: 'Modal', link: '/api/modal' },
        { text: 'Progress', link: '/api/progress' },
        { text: 'Tooltip', link: '/api/tooltip' },
        { text: 'Window', link: '/api/window', activeMatch: '/api/window$' },
        { text: 'WindowItem', link: '/api/window-item' },
        { text: 'ExpandTransition', link: '/api/expand-transition' },
      ],
    },
  ]
}
