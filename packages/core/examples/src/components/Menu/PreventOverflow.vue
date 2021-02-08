<template>
  <Menu bottom :allow-overflow="true">
    <template v-slot:activator>
      <Btn>
        Dropdown
      </Btn>
    </template>
    <MenuItem
      v-for="(item, i) in items"
      :key="item.value"
      :index="i"
    >
      {{ item.text }}
    </MenuItem>
  </Menu>
</template>

<script setup>
const items = Array.from(Array(20).keys()).map(key => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i}`,
  }
})
</script>
