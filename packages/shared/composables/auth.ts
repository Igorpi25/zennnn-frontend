import { ref, inject } from 'vue'
import Auth from '../plugins/auth/Auth'

import type { InjectionKey, Ref } from 'vue'
import type { AuthOptions } from '../plugins/auth/Auth'

export interface AuthInstance {
  auth: Auth
  isLoggedIn: Ref<boolean>
}

export const AuthSymbol: InjectionKey<AuthInstance> = Symbol.for('app:auth')

export function createAuth(config = {} as AuthOptions) {
  const auth = new Auth(config)
  const isLoggedIn = ref(false)

  return { auth, isLoggedIn }
}

export function useAuth() {
  const auth = inject(AuthSymbol)

  if (!auth) throw new Error('Could not find auth injection')

  return auth
}
