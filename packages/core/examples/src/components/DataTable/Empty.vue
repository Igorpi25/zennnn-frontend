<template>
  <DataTable
    :headers="headers"
  >
  </DataTable>
</template>

<script setup>
const headers = [
  { text: '', value: 'index', width: 50, sortable: false },
  { text: 'Country name', value: 'countryName', align: 'left', width: 160, sortable: true },
  { text: 'Official state name', value: 'officialName', align: 'left', width: 220, sortable: true },
  { text: 'Sovereignty', value: 'sovereignty', align: 'left', width: 150, sortable: true },
  { text: 'Alpha-2 code', value: 'alpha2', align: 'left', width: 125, sortable: true },
  { text: 'Alpha-3 code', value: 'alpha3', align: 'left', width: 125, sortable: true },
  { text: 'Numeric Code', value: 'numericCode', align: 'left', width: 140, class: 'pr-6', sortable: true },
  { text: 'Subdivision', value: 'subdivision', align: 'left', width: 130, sortable: true },
  { text: 'Internet ccTLD', value: 'domain', align: 'left', width: 120, sortable: false },
  { text: '', value: 'actions', width: 54 },
]
</script>
