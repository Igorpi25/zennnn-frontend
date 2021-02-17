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
        { text: 'Typography', link: '/', activeMatch: '^/$' },
        { text: 'Colors', link: '/styles/colors' },
        { text: 'Theme', link: '/styles/theme' },
      ]
    },
    {
      text: 'Components',
      children: [
        { text: 'Alerts', link: '/components/alerts' },
        { text: 'Buttons', link: '/components/buttons' },
        { text: 'Button Groups', link: '/components/button-groups' },
        { text: 'Checkboxes', link: '/components/checkboxes' },
        { text: 'DatePickers', link: '/components/date-pickers' },
        { text: 'Icons', link: '/components/icons' },
        { text: 'Images', link: '/components/images' },
        { text: 'Label', link: '/components/label' },
        { text: 'Loading', link: '/components/loading' },
        { text: 'Menus', link: '/components/menus' },
        { text: 'Messages', link: '/components/messages' },
        { text: 'Modals', link: '/components/modals' },
        { text: 'Progress', link: '/components/progress' },
        { text: 'Radio buttons', link: '/components/radio-buttons' },
        { text: 'Selects', link: '/components/selects' },
        { text: 'Switches', link: '/components/switches' },
        { text: 'Tables', link: '/components/tables' },
        { text: 'Text fields', link: '/components/text-fields' },
        { text: 'Textareas', link: '/components/textareas' },
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
        { text: 'Checkbox', link: '/api/checkbox' },
        { text: 'DataTable', link: '/api/data-table' },
        { text: 'DatePicker', link: '/api/date-picker' },
        { text: 'Icon', link: '/api/icon' },
        { text: 'Image', link: '/api/image' },
        { text: 'Label', link: '/api/label' },
        { text: 'Loading Spinner', link: '/api/loading-spinner' },
        { text: 'Menu', link: '/api/menu', activeMatch: '/api/menu$' },
        { text: 'MenuItem', link: '/api/menu-item' },
        { text: 'Messages', link: '/api/messages' },
        { text: 'Modal', link: '/api/modal' },
        { text: 'Progress', link: '/api/progress' },
        { text: 'Radio', link: '/api/radio' },
        { text: 'Select', link: '/api/select' },
        { text: 'Switch', link: '/api/switch' },
        { text: 'TextField', link: '/api/text-field' },
        { text: 'TextArea', link: '/api/text-area' },
        { text: 'Tooltip', link: '/api/tooltip' },
        { text: 'Window', link: '/api/window', activeMatch: '/api/window$' },
        { text: 'WindowItem', link: '/api/window-item' },
        { text: 'ExpandTransition', link: '/api/expand-transition' },
      ],
    },
  ]
}
