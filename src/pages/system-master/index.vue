<script setup>
import axios from '@axios'
import { useTheme } from 'vuetify'

const swal = inject('$swal')
const vuetifyTheme = useTheme()

const filter = reactive({
  keyword: '',
})

const table = reactive({
  loading: false,
  rows: [],
  page: 1,
  perPage: 10,
  orderBy: '',
  dir: '',
  totalPage: 1,
  totalRows: 0,
})

onMounted(() => {
  doSearch({ reload: true })
})

const doSearch = async options => {
  table.loading = true
  try {
    const params = {
      keyword: filter.keyword,
      page: options?.reload ? 1 : table.page,
      perPage: options?.perPage ?? table.perPage,
      orderBy: options?.orderBy ?? table.orderBy,
      dir: options?.dir ?? table.dir,
    }

    const response = await axios.get('/systems', { params })
    const { data } = response.data

    table.rows = data ?? []
    table.page = params.page
    table.perPage = params.perPage
    table.orderBy = params.orderBy
    table.dir = params.dir
    table.totalRows = response.headers['Total-Rows']
    table.totalPage = response.headers['Total-Page']
  } catch (e) {
    // api error
    if (e.response && !e.handled) {
      e.handled = true
      alert('Something went wrong!')
    }

    // app error
    if (!e.handled) {
      console.log(e)
    }
  }
  table.loading = false
}


const doDelete = item => {
  const currentThemeName = vuetifyTheme.name.value

  swal.fire({
    title: 'Delete',
    html: `Are you sure you want to delete this data?<br/>This action can not be undone.`,
    focusCancel: true,
    showCancelButton: true,
    showConfirmButton: true,
    showLoaderOnConfirm: true,
    confirmButtonText: '<i class="ti ti-trash-x"></i> Delete',
    confirmButtonColor: vuetifyTheme.themes.value[currentThemeName].colors.error,
    cancelButtonColor: vuetifyTheme.themes.value[currentThemeName].colors.secondary,
    preConfirm: async () => {
      try {
        const params = { id: item.id }

        await axios.delete('/systems', { params })

        return true
      } catch (e) {
        // api error
        if (e.response && !e.handled) {
          e.handled = true
          alert('Something went wrong!')
        }

        // app error
        if (!e.handled) {
          console.log(e)
        }

        return false
      }
    },
  }).then(result => {
    // success
    if (result.value) {
      doSearch()
    }
  })
}

const doSort = options => {
  table.orderBy = options.orderBy
  table.dir = options.dir
  doSearch()
}

// Computing pagination data
const paginationInfo = computed(() => {
  const firstIndex = table.rows.length ? (table.page - 1) * table.perPage + 1 : 0
  const lastIndex = table.rows.length + (table.page - 1) * table.perPage
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ table.totalRows ?? 0 } items`
})
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- Filters -->
          <VCardText>
            <VRow>
              <VCol cols="12">
                <!-- Search  -->
                <div style="width: 20rem;">
                  <VTextField
                    v-model="filter.keyword"
                    prepend-inner-icon="tabler-search"
                    placeholder="Please type keyword ... "
                    density="compact"
                    @keyup.enter="doSearch({ reload: true })"
                  />
                </div>
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div
              style="width: 80px;"
            >
              <VSelect
                v-model="table.perPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
                @update:model-value="doSearch({ reload: true })"
              />
            </div>

            <VSpacer />

            <div class="d-flex align-center flex-wrap gap-4">
              <VBtn
                prepend-icon="tabler-plus"
                to="/system-master/add"
              >
                Add
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable
            class="text-no-wrap"
          >
            <VOverlay
              v-model="table.loading"
              contained
              persistent
              class="align-center justify-center"
            >
              <VProgressCircular
                :size="50"
                indeterminate
                color="primary"
              />
            </VOverlay>

            <!-- table head -->
            <CTableHeaderSortable 
              :headers="[
                { field: 'system_category', name: 'category', sortable: true },
                { field: 'system_sub_category', name: 'sub category', sortable: true },
                { field: 'system_code', name: 'code', sortable: true },
                { field: 'system_value', name: 'value', sortable: true },
                { field: 'actions', class: 'text-center' },
              ]"
              :order-by="table.orderBy"
              :dir="table.dir"
              @sort="doSort"
            />
            <!-- table body -->
            <tbody>
              <tr
                v-for="row in table.rows"
                :key="row.id"
              >
                <!-- category -->
                <td>
                  <span class="text-base">{{ row.system_category }}</span>
                </td>

                <!-- sub category -->
                <td>
                  <span class="text-base">{{ row.system_sub_category }}</span>
                </td>

                <!-- code -->
                <td>
                  <span class="text-base">{{ row.system_code }}</span>
                </td>

                <!-- value -->
                <td>
                  <span class="text-base">{{ row.system_value }}</span>
                </td>

                <!-- Actions -->
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="$router.push(`/system-master/detail/${row.id}`)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-list"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="$router.push(`/system-master/edit/${row.id}`)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="doDelete(row)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                    />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- table footer  -->
            <tfoot v-show="!table.rows.length">
              <tr>
                <td
                  colspan="5"
                  class="text-center"
                >
                  No data available
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
            <span class="text-sm text-disabled">
              {{ paginationInfo }}
            </span>

            <VPagination
              v-model="table.page"
              size="small"
              :total-visible="5"
              :length="table.totalPage"
              @update:model-value="doSearch"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style>
  th .sortable {
    cursor: pointer;
  }
  th .sortable:hover {
    opacity: 0.8;
  }
  th .sortable .v-btn:not(.v-btn--active) {
    display: none;
  }
  th .sortable:hover .v-btn:not(.v-btn--active) {
    display: inline-grid;
  }
</style>
