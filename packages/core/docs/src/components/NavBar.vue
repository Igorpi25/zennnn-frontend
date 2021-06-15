<template>
  <header class="nav-bar max-w-8xl mx-auto sticky top-0 bg-white z-10 h-12 flex items-center border-b border-light-gray-400 px-6">
    <SideBarToggleButton @toggle="$emit('toggle')" />
    <router-link to="/">
      <Logo />
    </router-link>
  </header>
</template>

<script setup lang="ts">
import { defineEmit } from 'vue'
import Logo from './Logo.vue'
import SideBarToggleButton from './SideBarToggleButton.vue'

defineEmit(['toggle'])
</script>
