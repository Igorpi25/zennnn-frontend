import { ref, inject, watchEffect, InjectionKey, Ref, App } from 'vue'

export interface ThemeInstance {
  isDark: Ref<boolean>
}

export const ThemeSymbol: InjectionKey<ThemeInstance> = Symbol('Theme')

export function createTheme() {
  const isDark = ref(true)

  watchEffect(() => {
    if (isDark.value) {
      document.querySelector('html')?.classList.add('dark')
    } else {
      document.querySelector('html')?.classList.remove('dark')
    }
    // set theme meta && attribute
    const themeColor = isDark.value ? '#1E1E1E' : '#ffffff'
    document.head
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeColor)
  })

  const instance = { isDark }

  return {
    instance,
    install(app: App) {
      app.provide(ThemeSymbol, instance)
    },
  }
}

export function useTheme() {
  const theme = inject(ThemeSymbol)

  if (!theme) throw new Error('Could not find theme injection')

  return theme
}
