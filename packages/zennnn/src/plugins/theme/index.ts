import { createTheme } from '@/composables/theme'

const themePlugin = createTheme()

export default themePlugin

export const theme = themePlugin.instance
