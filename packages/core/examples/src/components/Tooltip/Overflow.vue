<template>
  <div class="overflow-y-auto border border-gray-300 border-dashed" style="max-height: 300px; max-width: 300px;">
    <div class="p-48" style="min-width: 1000px; min-height: 1000px;">
      <div class="py-8">
        <Tooltip top>
          <template v-slot:activator>
            <Btn x-small>Top</Btn>
          </template>
          <span>{{ content }}</span>
        </Tooltip>
      </div>
      <div class="py-8 pl-48">
        <Tooltip bottom max-width="100">
          <template v-slot:activator>
            <Btn x-small>Bottom</Btn>
          </template>
          <span>{{ content }}</span>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
const content = 'Slot slot slot slot. Slot slot slot slot. Slot slot slot slot.'
</script>
