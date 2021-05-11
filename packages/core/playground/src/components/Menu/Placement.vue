<template>
  <div class="space-x-4">
    <Menu placement="bottom-start" min-width="200">
      <template v-slot:activator>
        <Btn min-width="none">
          bottom-start
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
    <Menu placement="right-start" min-width="200">
      <template v-slot:activator>
        <Btn min-width="none">
          right-start
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
  </div>
</template>
