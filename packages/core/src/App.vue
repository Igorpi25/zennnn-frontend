<template>
  <header class="container py-4 space-x-4">
    <router-link
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      class="text-blue-500 hover:text-blue-600"
    >
      {{ route.text }}
    </router-link>
  </header>
  <main class="container py-8">
    <router-view />
  </main>
</template>

<script>
import routes from 'vite-plugin-pages/client'
import upperFirst from 'lodash-es/upperFirst'

export default {
  setup () {
    return {
      routes: routes.map(route => {
        return {
          name: route.name,
          path: route.path,
          props: route.props,
          text: upperFirst(route.name),
        }
      }),
    }
  },
}
</script>
