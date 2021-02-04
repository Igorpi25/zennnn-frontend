<template>
  <div class="max-w-8xl mx-auto">
    <div class="md:flex">
      <div class="w-64 xl:w-72 py-6 px-4">
        <ul class="text-sm px-2 mb-3">
          <li
            v-for="item in routes"
            :key="item.path"
            class="py-2 px-2"
          >
            <router-link :to="item.path" active-class="text-blue-500">
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="min-w-0 w-full flex-auto">
        <div class="flex w-full">
          <main class="max-w-3xl mx-auto min-w-0 w-full flex-auto p-6">
            <router-view />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import routes from 'vite-plugin-pages/client'
</script>
