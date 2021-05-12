<template>
  <div class="flex-grow flex flex-col relative">
    <div :class="['bg-gray-400']">
      <div class="container">
        <div :class="['flex h-14']">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" :class="['text-gray-100']">
              <svg width="113" height="18" viewBox="0 0 113 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M94.7098 11.306C95.8922 9.95102 96.9433 8.68343 98.0819 7.41584C100.009 5.27405 101.98 3.17597 104.257 1.42757C104.958 0.903048 105.702 0.291108 106.709 0.422238C108.111 0.640788 109.074 1.38386 109.643 2.69516C109.819 3.13226 109.775 3.48194 109.468 3.87533C107.541 6.41051 105.921 9.16424 105.089 12.2677C105.001 12.5736 104.958 12.9233 104.958 13.273C104.958 13.7101 105.264 13.8849 105.658 13.6664C106.14 13.3604 106.622 13.0544 107.016 12.661C108.505 11.1749 109.95 9.64505 111.395 8.1152C111.833 7.6781 112.096 7.59068 112.49 7.94036C112.972 8.33375 113.103 8.90198 112.797 9.29537C110.738 11.7431 108.724 14.2346 106.14 16.2016C105.352 16.8135 104.432 17.338 103.469 17.7314C101.629 18.5182 100.053 17.5129 99.8775 15.5459C99.7461 13.9286 100.272 12.4425 100.841 11.0001C101.936 8.37746 103.381 5.9297 104.958 3.52565C104.301 4.13759 103.6 4.70582 102.987 5.31776C99.6585 8.5523 96.5053 12.0054 93.7463 15.7207C93.396 16.2016 93.0894 16.6824 92.8267 17.2069C92.3887 17.9937 91.6442 18.2122 90.8559 17.7314C89.8925 17.1195 89.5859 16.1141 89.4983 15.0651C89.4545 14.5843 89.5421 14.1035 89.5421 13.6227C88.6224 14.4532 87.7466 15.3274 86.7393 16.0704C85.9072 16.6824 84.9876 17.2506 84.0241 17.6877C82.0972 18.5182 80.5206 17.5129 80.3892 15.4148C80.3016 13.8412 80.8271 12.3988 81.3965 10.9564C82.4475 8.33375 83.8927 5.9297 85.4693 3.52565C84.8124 4.13759 84.1117 4.70582 83.4986 5.31776C80.1702 8.5523 77.0171 12.0054 74.2581 15.7207C73.9077 16.2016 73.6012 16.6824 73.3384 17.2069C72.9005 17.9937 72.156 18.2122 71.3677 17.7314C70.4042 17.1195 70.0976 16.1141 70.0101 15.0651C69.9663 14.5843 70.0539 14.1035 70.0539 13.6227C69.1342 14.4532 68.2583 15.3274 67.251 16.0704C66.419 16.6824 65.4993 17.2506 64.5358 17.6877C62.6089 18.5182 61.0323 17.4691 60.9009 15.4148C60.8133 13.8412 61.2951 12.3551 61.9082 10.9564C62.4775 9.68876 63.0906 8.37746 63.7913 7.15358C64.492 5.9297 65.2803 4.74953 65.981 3.52565C65.3241 4.13759 64.6234 4.70582 64.0103 5.31776C60.682 8.5523 57.5288 12.0054 54.7698 15.7207C54.4194 16.2016 54.1129 16.6824 53.8501 17.2069C53.4122 17.9937 52.6677 18.2122 51.8794 17.7314C50.9159 17.1195 50.6094 16.1141 50.5218 15.0651C50.478 14.5843 50.5656 14.1472 50.6094 13.5352C50.3466 13.7975 50.1714 13.9723 49.9525 14.1909C48.5073 15.5896 47.0621 16.9446 45.1351 17.6877C43.1206 18.4745 41.544 17.4691 41.4127 15.3274C41.3251 13.7975 41.8506 12.3551 42.4199 10.9564C43.4272 8.46488 44.7848 6.14825 46.3176 4.00646C46.4052 3.87533 46.4928 3.7442 46.4928 3.52565C45.8358 4.13759 45.1351 4.70582 44.522 5.31776C41.3251 8.5523 38.1719 12.0054 35.4129 15.7207C35.0626 16.2016 34.756 16.6824 34.4932 17.2069C34.0553 17.9937 33.3108 18.2122 32.5225 17.7314C31.559 17.1195 31.2525 16.1141 31.2087 15.0651C31.1649 14.4969 31.2963 13.8849 31.3401 13.273C30.7708 13.7538 30.2014 14.2346 29.5883 14.7154C27.6614 16.2016 25.6031 17.4691 23.1506 17.8188C22.0996 17.9937 20.9609 17.9937 19.9099 17.7314C17.3698 17.1195 16.0122 14.8903 16.5378 12.2239C17.5012 7.241 20.2164 3.43823 24.5958 0.859338C25.3841 0.378528 26.3914 0.116268 27.311 0.0288478C30.6832 -0.320832 32.8729 2.56403 31.559 5.66744C30.289 8.72714 26.2162 11.2623 22.8879 10.9126C22.4499 10.8689 22.0558 10.7815 21.5741 10.6941C21.3113 11.5246 21.1799 12.3551 21.3551 13.2293C21.4865 13.8849 21.8806 14.2783 22.5813 14.4094C24.0265 14.6717 25.3403 14.2783 26.6103 13.7101C29.238 12.4862 31.3839 10.6941 33.2232 8.50859C34.0115 7.54697 34.4932 6.27938 35.1939 5.23034C36.1574 3.78791 37.2085 2.34548 38.2595 0.990468C38.8288 0.247398 39.3544 0.203688 40.1864 0.728208C40.493 0.903048 40.7558 1.16531 40.9747 1.42757C41.6316 2.17064 41.6316 2.52032 41.0185 3.26339C39.223 5.66744 37.6902 8.29004 36.4202 11.0001C36.3764 11.0438 36.3764 11.1312 36.3326 11.2623C37.515 9.90731 38.5661 8.63972 39.7047 7.37213C41.6316 5.23034 43.6024 3.13226 45.8796 1.38386C46.5803 0.859338 47.3248 0.247398 48.3321 0.378528C49.7335 0.597078 50.697 1.34015 51.2663 2.65145C51.4415 3.08855 51.3977 3.43823 51.0911 3.83162C49.1642 6.3668 47.5438 9.12053 46.7117 12.2239C46.5803 12.661 46.5366 13.3604 46.7993 13.579C47.2373 13.9286 47.719 13.4041 48.0255 13.0981C49.6021 11.5683 51.2225 10.0384 52.7115 8.37746C53.4998 7.45955 53.8939 6.23567 54.5946 5.23034C55.5581 3.7442 56.6091 2.34548 57.704 0.946758C58.2733 0.203688 58.7988 0.159978 59.5871 0.684498C59.8937 0.859338 60.2002 1.1216 60.463 1.42757C61.1199 2.17064 61.1199 2.47661 60.5068 3.26339C58.6237 5.66744 57.1347 8.29004 55.8646 11.0438C55.8208 11.0875 55.8208 11.1749 55.7771 11.306C56.9595 9.95102 58.0105 8.68343 59.1492 7.41584C61.0761 5.27405 63.0468 3.17597 65.3241 1.42757C66.0248 0.903048 66.7693 0.291108 67.7766 0.422238C69.178 0.640788 70.1414 1.38386 70.7108 2.69516C70.8859 3.13226 70.8421 3.48194 70.5356 3.87533C68.6087 6.41051 66.9883 9.16424 66.1562 12.2677C66.0686 12.5736 66.0248 12.8796 66.0248 13.1419C66.0248 13.7101 66.3314 13.8849 66.7693 13.579C67.2073 13.3167 67.6452 13.0107 67.9955 12.661C69.3531 11.306 70.7546 9.99473 71.9808 8.5523C72.8129 7.59068 73.2946 6.32309 73.9953 5.23034C74.9588 3.78791 76.0098 2.34548 77.1047 0.946758C77.674 0.203688 78.1995 0.203688 78.9878 0.684498C79.2944 0.859338 79.6009 1.1216 79.8637 1.42757C80.5206 2.17064 80.5206 2.47661 79.9075 3.26339C78.0681 5.66744 76.5791 8.29004 75.3091 11.0438C75.2653 11.0875 75.2653 11.1749 75.2653 11.306C76.5791 9.81989 77.7616 8.33375 79.1192 6.93503C80.9147 5.09921 82.8417 3.3071 84.7248 1.51499C84.9876 1.25273 85.2941 1.1216 85.6007 0.903048C87.3086 -0.408253 89.8487 1.1216 90.2866 2.91371C90.3742 3.17597 90.2428 3.61307 90.0676 3.83162C88.1407 6.41051 86.5203 9.16424 85.6445 12.2677C85.5569 12.5299 85.5131 12.8359 85.5131 13.0981C85.4693 13.7101 85.8196 13.9286 86.3014 13.579C86.7393 13.3167 87.1772 13.0107 87.5714 12.6173C88.8852 11.306 90.2866 10.0384 91.469 8.59601C92.3011 7.59068 92.7829 6.32309 93.5274 5.23034C94.4908 3.78791 95.5419 2.34548 96.6367 0.946758C97.206 0.203688 97.7316 0.159978 98.5199 0.684498C98.8264 0.859338 99.133 1.1216 99.3957 1.42757C100.053 2.17064 100.053 2.52032 99.4395 3.26339C97.6002 5.66744 96.1112 8.29004 94.8412 11.0001C94.7536 11.0875 94.7098 11.1749 94.7098 11.306ZM22.0558 9.33908C22.6689 9.20795 23.1506 9.20795 23.5886 8.9894C26.0848 7.89665 27.5738 5.84228 28.6249 3.39452C28.8 2.95742 29.1066 2.38919 28.6249 2.03951C28.1869 1.73354 27.6614 2.03951 27.311 2.38919C26.3914 3.21968 25.5155 4.05017 24.7272 4.96808C23.6324 6.19196 22.7565 7.63439 22.0558 9.33908Z" fill="currentColor"/>
                <path d="M12.4651 3.70048C10.9761 3.96274 9.53089 4.09387 8.17328 4.39984C7.51637 4.53097 4.84494 5.01178 4.31942 4.09387C3.88148 3.48193 4.27562 2.56402 4.31942 2.30176C4.40701 1.86466 4.36321 1.38385 4.49459 0.990457C4.62597 0.640777 4.93253 0.597067 5.28288 0.728197C5.67703 0.903037 6.11497 1.12159 6.50911 1.1653C9.57468 1.38385 12.6403 1.34014 15.662 0.728197C15.7058 0.728197 15.7934 0.684487 15.8372 0.684487C17.151 0.378517 17.4576 0.509647 18.1145 1.73353C18.2897 2.08321 18.421 2.43289 18.4648 2.78257C18.5086 3.00112 18.3772 3.3508 18.1583 3.48193C14.392 6.49792 10.8447 9.86359 7.2974 13.1856C7.12222 13.3604 6.90325 13.4915 6.68429 13.6664C6.72808 13.7101 6.77187 13.7101 6.81567 13.7538C7.47257 13.7538 8.12948 13.7101 8.83018 13.7538C9.79365 13.7975 10.8009 13.8412 11.7644 13.9723C12.9468 14.1909 13.8227 15.3273 13.8227 16.4638C13.8227 17.1632 13.6475 17.2506 13.0782 16.9446C12.8154 16.8135 12.5527 16.7698 12.2461 16.7698C10.2316 16.6386 8.26086 16.9883 6.29014 17.3817C5.58944 17.5128 4.84494 17.6877 4.14424 17.8625C3.57492 17.9937 3.0056 17.9499 2.52387 17.5566C1.6042 16.8135 0.991085 15.8956 0.815909 14.7154C0.772115 14.2346 0.903497 13.8412 1.29764 13.4478C4.27562 10.7815 7.20981 8.11519 10.1878 5.44888C10.8885 4.88065 11.6768 4.35613 12.4651 3.70048Z" fill="currentColor"/>
              </svg>
            </router-link>
          </div>
          <slot name="breadcrumbs" />
          <div class="flex-grow" />
          <div class="flex justify-end">
            <!-- Locale picker -->
            <LocalePicker :distance="16" />
            <!-- Menu -->
            <div
              class="flex items-center"
            >
              <a
                href="#"
                class="h-full"
                @click.prevent="logout"
              >
                <div class="flex items-center h-full text-gray-100">
                  <div class="hidden sm:block w-px h-5 bg-gray-300 mx-3" />
                  <div class="flex items-center h-full px-2 hover:bg-gray-200 transition-colors duration-100 ease-out">
                    <span>
                      {{ $t('header.signout') }}
                    </span>
                    <Icon
                      large
                      class="ml-2"
                    >
                      {{ icons.ziUserCircle }}
                    </Icon>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container pb-12">
      <div class="pt-4 pb-10">

        <div class="flex flex-wrap sm:flex-nowrap items-center justify-between pb-8">
          <TextField
            v-model="search"
            :placeholder="$t('placeholder.pageSearch')"
            :content-class="[search ? 'shadow-blue-500' : '', 'bg-transparent']"
            class="w-full md:max-w-md"
            input-class="placeholder-blue-500"
            clearable
          >
            <template v-slot:prepend>
              <Icon class="text-gray-100">
                {{ icons.ziSearch }}
              </Icon>
            </template>
          </TextField>
          <div class="flex w-full sm:w-auto items-center justify-end" style="min-width: 165px;">
            <Menu
              v-model="filterMenu"
              v-model:value="currentFilter"
              placement="bottom-start"
            >
              <template v-slot:activator>
                <div
                  class="group flex items-center cursor-pointer whitespace-nowrap"
                >
                  <span class="text-gray-100 group-hover:text-light-gray-400 pr-2">
                    {{ currentFilterText }}
                  </span>
                  <span class="relative">
                    <Icon
                      class="text-gray-200 group-hover:text-gray-100"
                    >
                      {{ currentFilter ? icons.ziFilter : icons.ziFilterOutline }}
                    </Icon>
                  </span>
                </div>
              </template>
              <MenuItem
                v-for="(item, i) in filtersItems"
                :key="item.value"
                :index="i"
                :value="item.value"
              >
                <span>{{ item.text }}</span>
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div
          class="sticky top-0 bg-gray-800 rounded-t-md px-sm flex items-center h-12 space-x-2"
          style="z-index: 1;"
        >
          <Btn
            :loading="approveLoading"
            :disabled="selected.length === 0"
            class="h-8 text-sm ml-sm"
            content-class="w-full flex items-center justify-center px-2"
            @click="approveWords"
          >
            {{ $t('words.approve') }}
          </Btn>
          <Btn
            :loading="hideLoading"
            :disabled="selected.length === 0"
            class="h-8 text-sm"
            content-class="w-full flex items-center justify-center px-2"
            outlined
            borderless
            @click="hideWords"
          >
            {{ $t('words.hide') }}
          </Btn>
          <Btn
            :loading="mergeLoading"
            :disabled="selected.length < 2"
            class="h-8 text-sm"
            content-class="w-full flex items-center justify-center px-2"
            outlined
            borderless
            @click="openMergeItem"
          >
            {{ $t('words.merge') }}
          </Btn>
          <div class="flex-grow" />
          <Progress
            v-if="queryLoading"
            indeterminate
            size="18"
            width="2"
          />
        </div>
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          :group-by="groupBy"
          :group-desc="groupDesc"
          :custom-group="customGroup"
          :loading="loading"
          table-width="100%"
          table-class="table-fixed rounded-t-none"
          hoverable
        >
          <template v-slot:header-status="{ header }">
            <td :width="header.width" class="text-left p-0">
              <input
                ref="select-all"
                v-model="selectAll"
                id="select-all"
                type="checkbox"
                class="inline-flex align-middle ml-3"
                @change="onSelectAll"
              />
            </td>
          </template>
          <template v-slot:header-content-en="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
                class="h-6 w-6 rounded-full mr-2"
              >
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-fr="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
                class="h-6 w-6 rounded-full mr-2"
              >
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-zh-Hans="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
                class="h-6 w-6 rounded-full mr-2"
              >
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-zh-Hant="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
                class="h-6 w-6 rounded-full mr-2"
              >
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-ru="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
                class="h-6 w-6 rounded-full mr-2"
              >
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-uk="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
                class="h-6 w-6 rounded-full mr-2"
              >
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-more="{ header }">
            <span class="inline-flex items-center pt-3">
              <Icon class="mr-2">
                {{ icons.ziGlobe }}
              </Icon>
              <span>{{ header.text }}</span>
            </span>
          </template>

          <template v-slot:items="{ items }">
            <template v-for="(item, index) in items">
              <tr
                v-if="item.group"
                :key="item.groupName"
                :style="{ background: 'transparent' }"
              >
                <td
                  :colspan="headers.length"
                  :style="{ height: '32px', paddingLeft: '46px' }"
                  class="text-gray-200 text-base leading-tight align-bottom p-0"
                >
                  <span class="text-white">{{ item.groupName }}</span> ({{ item.groupItemsCount }})
                </td>
              </tr>
              <tr
                v-else
                :key="index"
                class="cursor-default"
                :class="{ 'text-white expanded': expanded.includes(item.id), 'text-gray-300': item.isHidden }"
                tabindex="0"
              >
                <td
                  v-for="header in headers"
                  :key="header.value"
                  :class="['truncate', { 'text-right': header.value === 'more' }, header.value === 'status' ? 'relative p-0' : 'px-3']"
                  @click="header.value !== 'status' ? toggle(item.id) : null"
                >
                  <div v-if="header.value === 'status'" class="inline-block">
                    <span :class="['absolute top-0 left-0 w-xs h-full', item.status === 'DRAFT' ? 'bg-pink-500' : item.status === 'APPROVED' ? 'bg-green-500' : '']" />
                    <input
                      v-model="selected"
                      :id="item.id"
                      :value="item.id"
                      type="checkbox"
                      class="inline-flex align-middle ml-3"
                    />
                  </div>
                  <span v-if="header.value === 'more'" class="inline-flex items-center justify-end align-middle">
                    <button
                      class="flex items-center jusitfy-center text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none cursor-pointer mr-2"
                      @click.prevent.stop="openEditItem(item)"
                    >
                      <Icon small>
                        {{ icons.ziEdit }}
                      </Icon>
                    </button>
                    <button
                      class="text-blue-500 focus:text-blue-400 hover:text-blue-400 focus:outline-none ml-auto"
                    >
                      <Icon
                        class="transition-transform"
                        :class="{ 'transform rotate-90': expanded.includes(item.id) }"
                      >
                        {{ icons.ziChevronRight }}
                      </Icon>
                    </button>
                  </span>
                  <span v-else class="inline-flex items-center max-w-full">
                    <span class="flex-grow truncate">
                      {{ item[header.key] }}
                    </span>
                    <i
                      v-if="item[`${header.key}_ct`]"
                      class="text-gray-200 flex-shrink-0 ml-1"
                    >
                      <Icon :base="false">
                        {{ icons.ziLanguages }}
                      </Icon>
                    </i>
                  </span>
                </td>
              </tr>
              <tr
                v-if="expanded.includes(item.id)"
                :key="`expand-${item.id}`"
                class="expand bg-transparent"
                style="background-color: transparent;"
              >
                <td :colspan="headers.length" class="relative p-0">
                  <div class="bg-gray-700 rounded-b-md py-2 px-3 -mt-1" style="min-height: 52px;">
                    <WordProducts
                      :word="item"
                      :items="item.products"
                      @refetch="refetchListWords"
                    />
                  </div>
                  <div
                    class="absolute inset-x-0 top-0 pointer-events-none opacity-50 h-6 bg-gradient-to-b from-gray-900 to-gray-900-a-0 -mt-1"
                  />
                </td>
              </tr>
            </template>
          </template>

          <template v-slot:no-data>
            <div
              v-html="$t('words.noData')"
              class="text-center text-gray-200 leading-tight py-4"
            />
          </template>

        </DataTable>
        <Btn
          block
          outlined
          class="mt-4"
          @click="wordCreateDialog = true"
        >
          <Icon class="text-gray-100 mr-sm">
            {{ icons.ziEdit }}
          </Icon>
          <span>{{ $t('words.addWord') }}</span>
        </Btn>
      </div>
      <WordDialog
        v-model="wordCreateDialog"
        :org-id="orgId"
        create
        is-admin
        @create="onWordCreate"
      />
      <WordDialog
        v-model="wordEditDialog"
        :org-id="orgId"
        :item="editItem"
        is-admin
        @update="onWordUpdate"
      />
      <WordDialog
        v-model="wordMergeDialog"
        :org-id="orgId"
        :item="mergeItem"
        :title="$t('words.mergeWords')"
        is-admin
        submit-result
        @update="onWordMerge"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import { ziEdit, ziGlobe, ziLanguages, ziUserCircle, ziSearch, ziFilter, ziFilterOutline, ziChevronRight } from '@zennnn/icons'
import { Btn, Icon, Menu, MenuItem, Progress, TextField, DataTable } from '@zennnn/core'

import { LIST_WORDS } from '../../graphql/admin/queries'
import { APPROVE_WORDS, HIDE_WORDS, MERGE_WORDS } from '../../graphql/admin/mutations'
import { LOCALES_LIST } from '../../config/globals'

import WordProducts from '../../components/WordProducts.vue'
import LocalePicker from '../../components/LocalePicker.vue'
import WordDialog from '../../components/WordDialog.vue'

export default {
  name: 'WordList',
  components: {
    Btn,
    Icon,
    Menu,
    MenuItem,
    Progress,
    DataTable,
    TextField,
    WordProducts,
    LocalePicker,
    WordDialog,
  },
  setup () {
    const loggedOut = ref(false)
    const queryLoading = ref(false)
    const currentFilter = ref(null)

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const filters = computed(() => {
      return {
        status: statusFilter.value,
        showHiddens: currentFilter.value === 'HIDDEN',
        all: currentFilter.value === 'ALL',
      }
    })

    const statusFilter = computed(() => {
      switch (currentFilter.value) {
        case 'DRAFT': return 'DRAFT'
        case 'APPROVED': return 'APPROVED'
        default: return null
      }
    })

    const { result, loading, refetch: listWordsRefetch } = useQuery(LIST_WORDS, () => ({
      filters: filters.value,
    }), () => ({
      enabled: !loggedOut.value,
      fetchPolicy: 'cache-and-network',
    }))
    const listWords = useResult(result)

    watch(loading, (val) => {
      if (val) {
        queryLoading.value = true
      } else {
        setTimeout(() => {
          queryLoading.value = false
        }, 200)
      }
    })

    return {
      icons: {
        ziGlobe,
        ziLanguages,
        ziUserCircle,
        ziEdit,
        ziSearch,
        ziFilter,
        ziFilterOutline,
        ziChevronRight,
      },
      apolloClient,
      loggedOut,
      queryLoading,
      currentFilter,
      filters,
      statusFilter,
      loading,
      listWords,
      listWordsRefetch,
    }
  },
  data () {
    return {
      orgId: '',
      search: undefined,
      deleteLoading: null,
      wordCreateDialog: false,
      wordEditDialog: false,
      wordMergeDialog: false,
      expanded: [],
      editItem: {},
      selected: [],
      selectAll: false,
      approveLoading: false,
      mergeLoading: false,
      filterMenu: false,
      mergeItem: {},
      hideLoading: false,
    }
  },
  computed: {
    currentFilterText () {
      switch (this.currentFilter) {
        case 'DRAFT': return this.$t('words.DRAFT')
        case 'APPROVED': return this.$t('words.APPROVED')
        case 'DUPLICATES': return this.$t('words.DUPLICATES')
        case 'HIDDEN': return this.$t('words.HIDDEN')
        case 'ALL': return this.$t('words.ALL')
        default: return this.$t('words.noFilter')
      }
    },
    filtersItems () {
      return [
        {
          text: this.$t('words.noFilter'),
          value: null,
        },
        {
          text: this.$t('words.DRAFT'),
          value: 'DRAFT',
        },
        {
          text: this.$t('words.APPROVED'),
          value: 'APPROVED',
        },
        {
          text: this.$t('words.DUPLICATES'),
          value: 'DUPLICATES',
        },
        {
          text: this.$t('words.HIDDEN'),
          value: 'HIDDEN',
        },
        {
          text: this.$t('words.ALL'),
          value: 'ALL',
        },
      ]
    },
    locales () {
      const items = LOCALES_LIST.map(el => {
        return {
          ...el,
          key: el.value,
        }
      })
      const currentLocale = this.$i18n.locale
      const currentLocaleIndex = items.findIndex(el => el.value === currentLocale)
      if (currentLocaleIndex !== -1) {
        const removed = items.splice(currentLocaleIndex, 1)
        return [...removed, ...items]
      }
      return items
    },
    headers () {
      const locales = this.locales.map(el => {
        return {
          ...el,
          width: '130px',
          sortable: false,
          align: 'left',
          class: 'px-3',
        }
      })
      const status = {
        text: '',
        value: 'status',
        width: '30px',
        sortable: false,
        class: 'p-0',
      }
      const more = {
        text: this.$t('words.more'),
        value: 'more',
        width: '80px',
        sortable: false,
        align: 'left',
        class: 'px-3',
      }
      return [status, ...locales, more]
    },
    items () {
      const items = (this.listWords && this.listWords.items) || []
      if (this.currentFilter === 'DUPLICATES') {
        const map = items.map(item => {
          let duplicatesSearch = ''
          const result = Object.assign({}, item)
          const values = item.values || []
          LOCALES_LIST.forEach(locale => {
            const key = locale.value
            const value = values.find(v => v.k === key)
            if (value) {
              result[key] = value.v || value.tr || ''
              result[`${key}_ct`] = !value.v && value.tr
              const search = result[key].trim().toLocaleLowerCase()
              duplicatesSearch += `${search}~`
            }
          })
          result.duplicatesSearch = duplicatesSearch
          return result
        })
        return map
      }
      return items.map(item => {
        const result = Object.assign({}, item)
        const values = item.values || []
        LOCALES_LIST.forEach(locale => {
          const key = locale.value
          const value = values.find(v => v.k === key)
          if (value) {
            result[key] = value.v || value.tr || ''
            result[`${key}_ct`] = !value.v && value.tr
          }
        })
        return result
      })
    },
    groupBy () {
      return this.currentFilter === 'DUPLICATES' ? ['duplicatesSearch'] : [this.$i18n.locale]
    },
    groupDesc () {
      return [false]
    },
  },
  watch: {
    selected (val) {
      const el = this.$refs['select-all']
      if (!el) return
      if (val.length > 0 && val.length === this.items.length) {
        el.indeterminate = false
        el.checked = true
      } else if (val.length > 0 && val.length < this.items.length) {
        el.indeterminate = true
        el.checked = false
      } else if (val.length === 0) {
        el.indeterminate = false
        el.checked = false
      }
    },
    'currentFilter' () {
      this.selected = []
    },
    search (val) {
      this.selected = []
    },
  },
  methods: {
    async refetchListWords () {
      this.queryLoading = true
      await this.listWordsRefetch()
    },
    onSelectAll (e) {
      const target = e.target
      if (target.checked || target.indeterminate) {
        this.selected = this.items.map(el => el.id)
      } else {
        this.selected = []
      }
    },
    openEditItem (item) {
      this.editItem = item
      this.$nextTick(() => {
        this.wordEditDialog = true
      })
    },
    toggle (id) {
      if (this.expanded.indexOf(id) > -1) {
        const expIndex = this.expanded.indexOf(id)
        this.expanded.splice(expIndex, 1)
      } else {
        this.expanded.push(id)
      }
    },
    onWordCreate (result) {
      this.wordCreateDialog = false
      this.refetchListWords()
    },
    onWordUpdate () {
      this.wordEditDialog = false
    },
    openMergeItem () {
      const items = this.items.filter(item => this.selected.includes(item.id))
      const status = items.some(el => el.status === 'APPROVED') ? 'APPROVED' : 'DRAFT'
      let itemIndex = 0
      if (status === 'APPROVED') {
        itemIndex = items.findIndex(el => el.status === 'APPROVED')
      } else {
        // TODO: set value with max values?
        itemIndex = 0
      }
      const defaultItem = items[itemIndex]
      const item = {
        defaultLocale: defaultItem.defaultLocale,
        values: defaultItem.values.slice(),
      }
      this.mergeItem = item
      this.$nextTick(() => {
        this.wordMergeDialog = true
      })
    },
    async onWordMerge (input) {
      if (this.selected.length === 0) return
      this.wordMergeDialog = false
      const selected = this.selected.slice()
      try {
        this.mergeLoading = true
        await this.apolloClient.mutate({
          mutation: MERGE_WORDS,
          variables: {
            ids: selected,
            input,
          },
        })
        this.selected = []
        this.refetchListWords()
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.mergeLoading = false
      }
    },
    customGroup (items, groupBy, groupDesc) {
      const key = groupBy[0]
      const isDuplicatesSearch = key === 'duplicatesSearch'
      const desc = groupDesc[0]
      const re = /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
      const others = []
      const grouped = items.reduce((acc, curr) => {
        const name = curr[key] || ''
        if (isDuplicatesSearch) {
          if (Object.prototype.hasOwnProperty.call(acc, name)) {
            acc[name].push(curr)
          } else {
            acc[name] = [curr]
          }
        } else {
          const char = name.charAt(0).toLocaleUpperCase()
          if (re.test(char)) {
            if (Object.prototype.hasOwnProperty.call(acc, char)) {
              acc[char].push(curr)
            } else {
              acc[char] = [curr]
            }
          } else {
            others.push(curr)
          }
        }
        return acc
      }, {})
      const result = []
      let sorted = Object.keys(grouped).sort()
      if (desc) {
        sorted = sorted.reverse()
      }
      sorted.forEach(k => {
        const groupItems = grouped[k]
        const group = { name: k, items: groupItems }
        if (isDuplicatesSearch) {
          if (groupItems.length > 1) {
            result.push(group)
          }
        } else {
          result.push(group)
        }
      })
      if (others.length > 0) {
        if (desc) {
          result.unshift({ name: '#', items: others })
        } else {
          result.push({ name: '#', items: others })
        }
      }
      return result
    },
    async logout () {
      await this.$auth.signOut()
      this.loggedOut = true
      this.apolloClient.resetStore()
      this.$router.push({ name: 'login' })
    },
    async approveWords () {
      if (this.selected.length === 0) return
      const selected = this.selected.slice()
      try {
        this.approveLoading = true
        await this.apolloClient.mutate({
          mutation: APPROVE_WORDS,
          variables: {
            ids: selected,
          },
          update: (store, { data: { approveWords } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: LIST_WORDS, variables: { filters: this.filters } })
            // Add our tag from the mutation to the end
            selected.forEach(id => {
              const index = data.listWords.items.findIndex(el => el.id === id)
              if (index !== -1) {
                data.listWords.items[index].status = 'APPROVED'
              }
            })
            // Write our data back to the cache.
            store.writeQuery({ query: LIST_WORDS, variables: { filters: this.filters }, data })
          },
        })
        this.selected = []
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.approveLoading = false
      }
    },
    async hideWords () {
      if (this.selected.length === 0) return
      const selected = this.selected.slice()
      try {
        this.hideLoading = true
        await this.apolloClient.mutate({
          mutation: HIDE_WORDS,
          variables: {
            ids: selected,
          },
          update: (store, { data: { approveWords } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: LIST_WORDS, variables: { filters: this.filters } })
            // Add our tag from the mutation to the end
            if (this.filters.showHiddens) {
              selected.forEach(id => {
                const index = data.listWords.items.findIndex(el => el.id === id)
                if (index !== -1) {
                  data.listWords.items[index].isHidden = true
                }
              })
            } else {
              data.listWords.items = data.listWords.items.filter(el => !selected.includes(el.id))
            }
            // Write our data back to the cache.
            store.writeQuery({ query: LIST_WORDS, variables: { filters: this.filters }, data })
          },
        })
        this.selected = []
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.hideLoading = false
      }
    },
  },
}
</script>
