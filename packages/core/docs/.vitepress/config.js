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
        { text: 'Buttons', link: '/components/buttons' },
        { text: 'Icons', link: '/components/icons' },
      ],
    },
    {
      text: 'Api',
      children: [
        { text: 'Btn', link: '/api/btn' },
        { text: 'Icon', link: '/api/icon' },
      ],
    },
  ]
}
