<template>
  <div class="text-blue-500 -mb-6">
    <Progress
      :value="25"
      class="mr-6 mb-6"
    />
    <Progress
      :value="50"
      :width="3"
      class="mr-6 mb-6"
    />
    <Progress
      :value="80"
      :size="50"
      :width="5"
      class="mr-6 mb-6"
    />
    <Progress
      :value="70"
      :size="70"
      :width="7"
      class="mb-6"
    />
  </div>
</template>
