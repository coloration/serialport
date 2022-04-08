<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array as PropType<any[]>,
      default: () => ([]),
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => ([]),
    },
    total: {
      type: Number,
      default: 0,
    },
    pageCount: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
  },
})
</script>
<template>
  <div class="rounded-sm relative" v-bind="$attrs">
    <div>
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <!-- Table header -->
          <thead
            class="text-xs font-semibold uppercase text-gray-500 bg-gray-50 border-b border-gray-200"
          >
            <tr>
              <th v-if="checkable" class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                <div class="flex items-center">
                  <label class="inline-flex">
                    <span class="sr-only">Select all</span>
                    <input class="form-checkbox" type="checkbox" />
                  </label>
                </div>
              </th>
              <th
                v-for="(col, i) in columns"
                :key="i"
                class="px-2 first:pl-5 last:pr-5 py-2 whitespace-nowrap"
              >
                <div class="font-semibold text-left">{{ col.label }}</div>
              </th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <!-- Table body -->
            <slot
              v-for="(item, i) in items"
              :key="i"
              :item="item"
              :i="i"
              name="table-row"
            >
              <tr class="border-b border-gray-200">
                <td
                  v-for="(col, j) in columns"
                  :key="j"
                  class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <slot :name="'table-col-' + col.prop" :item="item">
                    <div class="flex items-center text-gray-800">
                      <!-- <div
                        class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full mr-2 sm:mr-3"
                      >
                        <img class="ml-1" :src="order.image" width="20" height="20" :alt="order.order" />
                      </div> -->
                      <div class="font-medium">{{ item[col.prop] }}</div>
                    </div>
                  </slot>
                </td>
              </tr>
            </slot>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
