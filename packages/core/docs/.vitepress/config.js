module.exports = {
  lang: 'en-US',
  title: 'ZENNNN UI',
  description: 'ZENNNN ui components.',

  themeConfig: {
    sidebar: getSidebar(),
  }
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
        { text: 'Progress', link: '/components/progress' },
        { text: 'Loading', link: '/components/loading' },
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
        { text: 'Progress', link: '/api/progress' },
        { text: 'Loading Spinner', link: '/api/loading-spinner' },
        { text: 'ExpandTransition', link: '/api/expand-transition' },
      ],
    },
  ]
}
