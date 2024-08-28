<script setup>
const props = defineProps({
  headers: {
    type: Array,
    default: () => ([]),
  },
  orderBy: {
    type: String,
    default: '',
  },
  dir: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['sort'])

const onSort = fieldname => {
  let field = fieldname
  let dir = 'asc'

  if (props.orderBy === fieldname) {
    if (props.dir === 'asc') {
      dir = 'dsc'
    } else {
      field = ''
      dir = ''
    }
  }

  emit('sort', { orderBy: field, dir: dir })
}
</script>

<template>
  <thead>
    <tr>
      <th
        v-for="(head, i) in headers"
        :key="i"
        scope="col"
      >
        <div
          v-if="head.sortable"
          class="d-flex align-center th-sortable"
          @click="onSort(head.field)"
        >
          <span :class="`flex-grow-1 text-uppercase ${head.class}`">
            {{ head.name ?? head.field }}
          </span>
          <VBtn
            icon
            size="x-small"
            variant="plain"
            :active="head.field === props.orderBy"
          >
            <VIcon
              v-show="props.dir !== 'dsc' || !head.field === props.orderBy"
              size="22"
              icon="tabler-sort-ascending"
            />
            <VIcon
              v-show="props.dir === 'dsc' && head.field === props.orderBy"
              size="22"
              icon="tabler-sort-descending"
            />
          </VBtn>
        </div>
        <div
          v-else
          :class="`text-uppercase ${head.class}`"
        >
          {{ head.name ?? head.field }}
        </div>
      </th>
    </tr>
  </thead>
</template>

<style>
  .th-sortable {
    cursor: pointer;
  }
  .th-sortable > span {
    padding-right: 8px;
  }
  .th-sortable:hover {
    opacity: 0.8;
  }
  .th-sortable .v-btn:not(.v-btn--active) {
    opacity: 0;
  }
  .th-sortable:hover .v-btn:not(.v-btn--active) {
    opacity: 1;
  }
</style>