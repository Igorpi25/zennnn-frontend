<template>
  <div>
    <h1 class="text-6xl mb-6">404</h1>
    <blockquote class="border-l-4 border-light-gray-200 text-gray-100 p-1 pl-4 mb-6">{{ getMsg() }}</blockquote>
    <a :href="$site.base" aria-label="go to home" class="text-blue-500 hover:text-blue-400">Take me home.</a>
  </div>
</template>

<script setup lang="ts">
const msgs = [
  `There's nothing here.`,
  `How did we get here?`,
  `That's a Four-Oh-Four.`,
  `Looks like we've got some broken links.`
]

function getMsg() {
  return msgs[Math.floor(Math.random() * msgs.length)]
}
</script>
