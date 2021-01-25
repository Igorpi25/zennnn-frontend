<template>
  <header class="sticky top-0 bg-white z-10 h-12 flex items-center border-b border-light-gray-400 px-4">
    <router-link to="/" class="font-semibold text-xl">
      Playground
    </router-link>
  </header>
  <nav id="sidebar" class="w-64 fixed top-0 mt-12 py-6 px-4">
    <div
      v-for="route in routes"
      :key="route.name"
      class="h-8 flex items-center"
    >
      <router-link
        :to="route.path"
        class="group"
        v-slot="{ isExactActive }"
      >
        <span :class="[
          'group-hover:text-blue-500',
          isExactActive ? 'text-blue-500' : 'text-gray-200',
        ]">
          {{ route.text }}
        </span>
      </router-link>
    </div>
  </nav>
  <main class="flex-grow py-6 px-4 mx-64">
    <router-view />
  </main>
  <nav id="toc" class="w-64 fixed py-6 px-4"></nav>
</template>

<script>
import routes from 'vite-plugin-pages/client'
import upperFirst from 'lodash-es/upperFirst'

export default {
  setup () {
    return {
      routes: routes
        .filter(route => route.name !== 'index')
        .map(route => {
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
