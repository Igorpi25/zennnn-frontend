export default {
  props: [
    {
      name: 'tag',
      type: '<span class="token string">string</span>',
      default: '<span class="token string">button</span>',
      description: 'Specify a custom tag used on the root element.',
    },
    {
      name: 'to',
      type: '<span class="token string">string</span><span class="token operator">|</span>object',
      default: '<span class="token keyword">undefined</span>',
      description: 'Denotes the target route of the link.',
    },
    {
      name: 'append',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Setting append prop always appends the relative path to the current path.'
    },
    {
      name: 'replace',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Setting replace prop will call router.replace() instead of router.push() when clicked, so the navigation will not leave a history record.'
    },
    {
      name: 'href',
      type: '<span class="token string">string</span>',
      default: '<span class="token keyword">undefined</span>',
      description: 'Designates the component as anchor and applies the href attribute.'
    },
    {
      name: 'loading',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Adds a loading icon animation.'
    },
    {
      name: 'disabled',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Removes the ability to click or target the component.'
    },
    {
      name: 'primary',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token keyword">undefined</span>',
      description: 'Default style, used when not `text`, `outlined` and `false`.'
    },
    {
      name: 'block',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Expands the button to 100% of available space.'
    },
    {
      name: 'outlined',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Makes the background transparent and applies a thin border.'
    },
    {
      name: 'xSmall',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Makes the component extra small.'
    },
    {
      name: 'mini',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Makes the component mini.'
    },
    {
      name: 'text',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Makes the background transparent. When using the color prop, the color will be applied to the button text instead of the background.'
    },
    {
      name: 'icon',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Removes min-width/height styles.'
    },
    {
      name: 'darkIcon',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Icon dark color decortion.'
    },
    {
      name: 'small',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Makes the component small.'
    },
    {
      name: 'light',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Applies the light theme variant to the component.'
    },
    {
      name: 'dark',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Applies the dark theme variant to the component.'
    },
    {
      name: 'contentClass',
      type: '<span class="token string">string</span>',
      default: '<span class="token string">""</span>',
      description: 'Content CSS class.'
    },
    {
      name: 'minWidth',
      type: '<span class="token string">string</span><span class="token operator">|</span><span class="token builtin">number</span>',
      default: '<span class="token keyword">undefined</span>',
      description: 'Sets the minimum width for the component.'
    },
    {
      name: 'maxWidth',
      type: '<span class="token string">string</span><span class="token operator">|</span><span class="token builtin">number</span>',
      default: '<span class="token keyword">undefined</span>',
      description: 'Sets the maximum width for the component.'
    },
  ],
  slots: [
    {
      name: 'default',
      description: 'The default Vue slot.',
    },
    {
      name: 'loader',
      description: 'Custom loader.',
    },
  ],
}
