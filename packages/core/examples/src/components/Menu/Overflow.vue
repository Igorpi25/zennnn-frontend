<template>
  <div class="overflow-y-auto border border-gray-300 border-dashed" style="max-height: 300px; max-width: 300px;">
    <div class="p-48" style="min-width: 1000px; min-height: 1000px;">
      <div class="py-8">
        <Menu top max-height="304">
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
      </div>
      <div class="py-8 pl-48">
        <Menu bottom max-height="304">
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
      </div>
    </div>
  </div>
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
