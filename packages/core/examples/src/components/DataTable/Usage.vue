<template>
  <DataTable
    :headers="headers"
    :items="items"
    hoverable
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
  { text: 'Internet ccTLD', value: 'domain', align: 'left', width: 120, sortable: true },
  { text: '', value: 'actions', width: 54 },
]

const items = [
  {
    countryName: 'China',
    officialName: 'The People\'s Republic of China',
    sovereignty: 'UN member state',
    alpha2: 'CN',
    alpha3: 'CHN',
    numericCode: 156,
    subdivision: 'ISO 3166-2:CN',
    domain: '.cn',
  },
  {
    countryName: 'France',
    officialName: 'The French Republic',
    sovereignty: 'UN member state',
    alpha2: 'FR',
    alpha3: 'FRA',
    numericCode: 250,
    subdivision: 'ISO 3166-2:FR',
    domain: '.fr',
  },
  {
    countryName: 'Russian Federation',
    officialName: 'The Russian Federation',
    sovereignty: 'UN member state',
    alpha2: 'RU',
    alpha3: 'RUS',
    numericCode: 643,
    subdivision: 'ISO 3166-2:RU',
    domain: '.ru',
  },
  {
    countryName: 'Ukraine',
    officialName: 'Ukraine',
    sovereignty: 'UN member state',
    alpha2: 'UA',
    alpha3: 'UKR',
    numericCode: 804,
    subdivision: 'ISO 3166-2:UA',
    domain: '.ua',
  },
  {
    countryName: 'United Kingdom of Great Britain and Northern Ireland',
    officialName: 'The United Kingdom of Great Britain and Northern Ireland',
    sovereignty: 'UN member state',
    alpha2: 'GB',
    alpha3: 'GBR',
    numericCode: 826,
    subdivision: 'ISO 3166-2:GB',
    domain: '.gb .uk',
  },
]
</script>
