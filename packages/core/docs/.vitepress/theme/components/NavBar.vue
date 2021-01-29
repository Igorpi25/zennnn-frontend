<template>
  <header class="nav-bar sticky top-0 bg-white z-10 h-12 flex items-center border-b border-light-gray-400 px-6">
    <SideBarToggleButton @toggle="$emit('toggle')" />
    <a :href="$withBase('/')">
      <Logo />
    </a>
  </header>
</template>

<script setup>
import { defineEmit } from 'vue'
import Logo from './Logo.vue'
import SideBarToggleButton from './SideBarToggleButton.vue'

defineEmit(['toggle'])
</script>
