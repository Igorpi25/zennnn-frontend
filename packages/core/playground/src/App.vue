<template>
  <div class="max-w-8xl mx-auto">
    <div class="h-12 flex items-center justify-between px-4">
      <router-link to="/" class="pr-4">Playground</router-link>
      <div class="flex space-x-1">
        <Switch v-model="isDark" />
        <Icon>
          {{ isDark ? ziMoon : ziSun }}
        </Icon>
      </div>
    </div>
    <div class="md:flex">
      <div class="w-64 xl:w-72 py-6 overflow-y-auto h-page-wrapper">
        <div class="px-2">
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
import { ziSun, ziMoon } from '@zennnn/icons'
import { routes } from './router'

const searchStorageKey = 'page:Search'
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
  sessionStorage.setItem(searchStorageKey, val)
})

onBeforeMount(() => {
  const storageSearch = sessionStorage.getItem(searchStorageKey)
  if (storageSearch) {
    search.value = storageSearch
  }
})
</script>
