<template>
  <div class="max-w-[90rem] mx-auto">
    <div
      v-if="isSidebarOpen"
      class="md:hidden fixed top-0 left-0 w-screen h-screen z-10"
      @click="toggleMenu(false)"
    />
    <div
      class="
        z-10
        sticky
        top-0
        bg-white
        dark:bg-gray-650
        bg-opacity-70
        dark:bg-opacity-70
        backdrop-blur-xl
        h-12
        flex
        items-center
        justify-between
        space-x-4
        px-4
      "
    >
      <div class="flex space-x-4">
        <Icon class="md:hidden hover:text-gray-200" @click="toggleMenu">
          {{ ziMenu }}
        </Icon>
        <router-link to="/">Playground</router-link>
      </div>
      <div class="flex space-x-1">
        <Switch v-model="isDark" />
        <Icon>
          {{ isDark ? ziMoon : ziSun }}
        </Icon>
      </div>
    </div>
    <div class="md:flex">
      <div
        :class="[
          '-translate-x-full md:translate-x-0 transition-transform duration-200 fixed md:sticky top-12 z-10 w-64 xl:w-72 bg-white dark:bg-gray-650 border-r md:border-r-0 border-light-gray-400 dark:border-gray-700 overflow-y-auto h-[calc(100vh-3rem)] pb-6',
          { 'translate-x-0': isSidebarOpen },
        ]"
      >
        <div class="sticky top-0 bg-white dark:bg-gray-650 pt-4 px-2">
          <TextField v-model="search" placeholder="Search ..." clearable />
        </div>
        <ul class="text-sm px-2 mb-3">
          <template v-for="route in filteredRoutes" :key="route.name">
            <li class="uppercase text-sm text-gray-200 py-2 px-2">
              {{ route.name }}
            </li>
            <li
              v-for="child in route.children"
              :key="child.name"
              class="py-2 px-2"
            >
              <router-link :to="child.path" active-class="text-blue-500">
                {{ child.name }}
              </router-link>
            </li>
          </template>
        </ul>
      </div>
      <div
        class="
          min-w-0
          w-full
          flex-auto
          bg-light-gray-100
          dark:bg-gray-500
          dark:text-gray-100
        "
      >
        <div class="flex w-full">
          <main class="max-w-3xl mx-auto min-w-0 w-full flex-auto p-6">
            <router-view v-slot="{ Component }">
              <Suspense>
                <component :is="Component" />
              </Suspense>
            </router-view>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watchEffect, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ziSun, ziMoon, ziMenu } from '@zennnn/icons'
import { routes } from './router'

const route = useRoute()
const searchStorageKey = 'page:Search'
const isSidebarOpen = ref(false)
const isDark = ref(false)
const search = ref('')

const filter = (itemText: string, queryText: string) =>
  itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1

const filteredRoutes = computed(() => {
  if (!search.value) return routes
  const filtered = routes.filter(
    (r) =>
      filter(r.name, search.value) ||
      r.children.some((c) => filter(c.name, search.value))
  )
  return filtered.map((r) => {
    return {
      name: r.name,
      children: r.children.filter((c) => filter(c.name, search.value)),
    }
  })
})

watchEffect(() => {
  if (isDark.value) {
    document.querySelector('html')?.classList.add('dark')
  } else {
    document.querySelector('html')?.classList.remove('dark')
  }
})

watch(search, (val) => {
  if (!val) {
    sessionStorage.removeItem(searchStorageKey)
  } else {
    sessionStorage.setItem(searchStorageKey, val)
  }
})

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false
  }
)

onBeforeMount(() => {
  const storageSearch = sessionStorage.getItem(searchStorageKey)
  if (storageSearch) {
    search.value = storageSearch
  }
})

function toggleMenu(to: boolean | undefined) {
  isSidebarOpen.value = typeof to === 'boolean' ? to : !isSidebarOpen.value
}
</script>
