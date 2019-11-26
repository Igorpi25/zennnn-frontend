<template>
  <div>

    <v-dialog
      v-model="createStaffDialog"
      :adaptive="true"
      :max-width="460"
    >
      <StaffCreateModal @close="closeCreateStaffModal" />
    </v-dialog>

    <div class="container container--sm">
      <div class="pt-10">
        <div v-if="loading">{{ `${$t('action.loading')}...` }}</div>

        <div class="pt-5 pb-6">
          <TextField
            v-model="search"
            :placeholder="$t('placeholder.pageSearch')"
            solo
            outlined
            background-dark
            hide-details
            height="40"
            class="max-w-2xl text-2xl leading-normal mx-auto"
          >
            <template v-slot:append>
              <Icon size="24">{{ icons.mdiMagnify }}</Icon>
            </template>
          </TextField>
        </div>

        <div class="overflow-x-auto">
          <DataTable
            :headers="headers"
            :items="items"
            :search="search"
            table-width="100%"
            table-class="table-fixed"
            thead-class="text-accent2 border-b border-accent2"
          >
            <template v-slot:header.status="{ header }">
              <td
                :width="header.width + 'px'"
                class="px-3"
              >
                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 10"><defs><clipPath id="ClipPath1016"><path d="M5.00003,0c2.76138,0 4.99994,2.23864 4.99994,5.00005c0,2.76141 -2.23856,4.99997 -4.99994,4.99997c-2.76152,0 -5.00007,-2.23855 -5.00007,-4.99997c0,-2.76141 2.23856,-5.00005 5.00007,-5.00005z" fill="currentColor"></path></clipPath></defs><g><g><title>Status</title><path d="M5.00003,0c2.76138,0 4.99994,2.23864 4.99994,5.00005c0,2.76141 -2.23856,4.99997 -4.99994,4.99997c-2.76152,0 -5.00007,-2.23855 -5.00007,-4.99997c0,-2.76141 2.23856,-5.00005 5.00007,-5.00005z" fill-opacity="0" fill="currentColor" stroke-dashoffset="0" stroke-dasharray="" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#414141" stroke-miterlimit="50" stroke-width="2" clip-path="url(&quot;#ClipPath1016&quot;)"></path></g></g></svg>
              </td>
            </template>
            <template v-slot:header.debt="{ header }">
              <td
                :width="header.width + 'px'"
                class="px-3"
              >
                ($→)
              </td>
            </template>
            <template v-slot:header.fullName="{ header }">
              <td
                :width="header.width + 'px'"
                class="text-left pl-10"
              >
                {{ $t('staff.fullName') }}
              </td>
            </template>

             <template v-slot:items="{ items }">
              <template v-for="(item, index) in items">
                <tr :key="item.id" class="items bg-background hover:bg-accent3 border-none">
                  <td class="relative px-3">
                    <span
                      :class="[
                        'status-indicator inline-block',
                        item.status === 'ORANGE'
                          ? 'status-indicator--orange' : item.status === SpecStatus.IN_STOCK
                            ? 'status-indicator--green' : 'status-indicator--pink'
                      ]"
                    >
                    </span>
                  </td>
                  <td>
                    <span class="flex item-center" @click="toggle(index)">
                      <span>{{ item.inWork }}</span>
                      <div class="icon" style="width:18px">
                        <div class="icon__item">
                          <Icon v-if="expanded && expanded.length !== 0">{{ icons.mdiChevronDown }}</Icon>
                          <Icon v-else>{{ icons.mdiChevronUp }}</Icon>
                        </div>
                      </div>
                    </span>
                  </td>
                  <td>{{ item.diff }}</td>
                  <td>{{ item.diffPercent }}</td>
                  <td class="text-right">{{ item.revenue }}</td>
                  <td class="text-right">{{ item.costOfGoods }}</td>
                  <td class="text-left pl-10">{{ item.fullName }}</td>
                  <td class="text-left">{{ item.access }}</td>
                  <td class="text-right pointer-events-none" @click.prevent.stop>
                    <div
                      class="cursor-pointer pointer-events-auto"
                      @click="deleteProject(item.id)"
                    >
                      <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 13 16"><defs></defs><g><g><title>Delete</title><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAAAU0lEQVQ4T2NkQANBQUH/0cXWrVvHiCyGwgFJgDQhK0Lng9QwYjMZ3SZ0PoZNhDSQbxM2N+OzDaQe7CeQx0mhSVIMM3xUEzSUKQsIYpIPLEGTlWAB2MDtgmErnM4AAAAASUVORK5CYII=" width="13" height="16" transform="matrix(1,0,0,1,0,0)" ></image></g></g></svg>
                    </div>
                  </td>
                </tr>
                <template v-if="expanded.includes(index)" class="expanded">
                    <tr class="items text-sm bg-chaos-black" :key="`expand-${index}`">
                      <td class=" text-right relative px-3">
                        <span
                          :class="[
                            'status-mini',
                            'status-indicator inline-block',
                            item.status === 'ORANGE'
                              ? 'status-indicator--orange' : item.status === SpecStatus.IN_STOCK
                                ? 'status-indicator--green' : 'status-indicator--pink'
                          ]"
                        >
                        </span>
                      </td>
                      <td class="text-center relative">
                        <div class="staff__triangle"></div>
                        <span>+$</span>&nbsp;&nbsp;<span>-$</span>
                      </td>
                      <td>25 000</td>
                      <td>55%</td>
                      <td class="text-right">50 000</td>
                      <td class="text-right">25 000</td>
                      <td class="text-center">FF024-2019-03-13-2</td>
                      <td class="text-center">Elton John</td>
                      <td></td>
                    </tr>
                </template>
              </template>
            </template>
          </DataTable>
        </div>
        <Button
          outline
          class="mt-6"
          @click="createStaff"
        >
          <template v-slot:icon>
            <Icon>
              {{ icons.mdiPlusCircleOutline }}
            </Icon>
          </template>
          <span>{{ $t('staff.createStaff') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mdiMagnify,
  mdiChevronUp,
  mdiChevronDown,
  mdiPlusCircleOutline,
} from '@mdi/js'

import StaffCreateModal from '@/components/StaffCreateModal.vue'

export default {
  name: 'Home',
  components: {
    StaffCreateModal,
  },
  data () {
    return {
      search: '',
      loading: false,
      createLoading: false,
      deleteLoading: null,
      createStaffDialog: false,
      items: [
        {
          status: 'ORANGE',
          inWork: 3,
          diff: '150 005',
          diffPercent: '50%',
          revenue: '300 000',
          costOfGoods: '150 000',
          fullName: 'Игорь Иванов',
          access: 'Директор',
        },
      ],
      expanded: [],
      errors: [],
      icons: {
        mdiMagnify,
        mdiChevronUp,
        mdiChevronDown,
        mdiPlusCircleOutline,
      },
    }
  },
  computed: {
    headers () {
      return [
        { text: '', value: 'status', align: 'left', width: 45, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('staff.inWork'), value: 'inWork', align: 'left', width: 80, minWidth: 80, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('staff.diff'), value: 'diff', align: 'left', width: 60, minWidth: 60, bgcolor: 'tansparent' },
        { text: '(%)', value: 'diffPercent', align: 'left', width: 40, minWidth: 40, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('staff.revenue'), value: 'revenue', align: 'right', width: 80, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('staff.costOfGoods'), value: 'costOfGoods', align: 'right', width: 120, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('staff.fullName'), value: 'fullName', align: 'left', width: 180, minWidth: 180, bgcolor: 'tansparent' },
        { text: this.$t('staff.access'), value: 'access', align: 'left', width: 120, minWidth: 120, bgcolor: 'tansparent' },
        { text: '', value: 'actions', width: 48, bgcolor: 'tansparent' },
      ]
    },
  },
  methods: {
    createStaff () {
      this.createStaffDialog = true
    },
    closeCreateStaffModal () {
      this.$modal.hide('create-staff')
    },
    toggle (index) {
      if (this.expanded.indexOf(index) > -1) {
        this.expanded.splice(index, 1)
      } else this.expanded.push(index)
    },
  },
}
</script>

<style>
.status-mini {
  transform: scale(0.6);
}
.items:hover  .traingle {
  @apply bg-gray;
}
.staff__triangle {
  width: 14px;
  height: 14px;
  transform: rotate(45deg);
  background-color: #0F0F0F;
  position: absolute;
  top: -7px;
  left: 15px;
}
</style>