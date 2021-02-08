<template>
  <Menu bottom :close-on-content-click="false">
    <template v-slot:activator>
      <Btn>
        Menu
      </Btn>
    </template>
    <div
      v-for="item in 5"
      :key="item"
      class="h-9 flex items-center px-5"
    >
      Content
    </div>
  </Menu>
</template>
