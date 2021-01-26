export default {
  props: [
    {
      name: 'tag',
      type: '<span class="token string">string</span>',
      default: '<span class="token string">i</span>',
      description: 'Specify a custom tag used on the root element.',
    },
    {
      name: 'size',
      type: '<span class="token string">string</span><span class="token operator">|</span><span class="token builtin">number</span>',
      default: '<span class="token keyword">undefined</span>',
      description: 'Specifies a custom font size for the icon.',
    },
    {
      name: 'small',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Makes the component small.'
    },
    {
      name: 'large',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Makes the component large.'
    },
    {
      name: 'base',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">true</span>',
      description: 'Icon base size 24px, disable for set size from `font-size`.'
    },
    {
      name: 'left',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Adds `icon--left` class.'
    },
    {
      name: 'right',
      type: '<span class="token builtin">boolean</span>',
      default: '<span class="token boolean">false</span>',
      description: 'Adds `icon--right` class.'
    },
  ],
  slots: [
    {
      name: 'default',
      description: 'The default Vue slot.',
    },
  ],
}
