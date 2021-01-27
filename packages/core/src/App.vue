<template>
  <header class="sticky top-0 bg-white z-10 h-12 flex items-center border-b border-light-gray-400 px-6">
    <Icon
      class="md:hidden hover:text-gray-200 active:text-gray-200 mr-3"
      @click="toggleMenu"
    >
      {{ ziMenu }}
    </Icon>
    <router-link to="/" class="font-semibold text-xl">
      UI
    </router-link>
  </header>
  <nav id="sidebar"
    :class="{ 'open' : isOpen }"
    class="bg-white border-r md:border-r-0 border-light-gray-400 w-64 xl:w-72 fixed top-0 overflow-y-auto transform -translate-x-full md:translate-x-0 transition-transform duration-200 mt-12 py-6 px-4"
  >
    <div
      v-for="item in items"
      :key="item.name"
      class="mb-1"
    >
      <router-link
        :to="item.path"
        v-slot="{ isExactActive, navigate, href }"
        custom
      >
        <a
          :href="href"
          :class="[
            'block hover:bg-gray-100 bg-opacity-10 hover:bg-opacity-10 rounded py-1 px-2',
            isExactActive ? 'text-blue-500 hover:text-blue-500 bg-blue-500 hover:bg-blue-500' : 'text-gray-400',
          ]"
          @click="navigate"
        >
          {{ item.text }}
        </a>
      </router-link>
    </div>
  </nav>
  <div
    id="sidebar-mask"
    v-if="isOpen"
    class="md:hidden fixed top-0 left-0 w-screen h-screen"
    @click="isOpen = false"
  />
  <main class="flex-grow md:ml-64 xl:ml-72 xl:mr-72 p-6">
    <div class="max-w-screen-md mx-auto">
      <router-view />
    </div>
  </main>
  <nav id="toc" class="hidden lg:block w-64 xl:w-72 fixed py-6 px-4"></nav>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import routes from 'vite-plugin-pages/client'
import upperFirst from 'lodash-es/upperFirst'
import { ziMenu } from '@zennnn/icons'

const route = useRoute()

const items = routes
  .filter(route => route.name !== 'index')
  .map(route => {
    return {
      name: route.name,
      path: route.path,
      props: route.props,
      text: upperFirst(route.name),
    }
  })

const isOpen = ref(false)

watch(() => route.path, () => { isOpen.value = false })

function toggleMenu () {
  isOpen.value = !isOpen.value
}
</script>
