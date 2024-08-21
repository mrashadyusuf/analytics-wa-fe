<script setup>
import axiosInstance from '@/services/axiosInstance'
import { useTheme } from 'vuetify'
import { doLogout } from '@/utils/authUtils'

const swal = inject('$swal')
const constants = inject('$constants')
const vuetifyTheme = useTheme()
const route = useRoute()
const router = useRouter()

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

const getTransactions = async (offset = 0, limit = 10) => {
  const response = await axiosInstance.get('transactions/', {
    params: {
      offset: offset,
      limit: limit
    }
  })
  .then((res) => {
      console.log("res", res);
      return res;
    })
    .catch((error) => {
      console.log("error response", error.response);  // Log the error response
      return error.response;
    });
  return response;
}



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

    const response = await getTransactions(params.page, params.perPage) // Ensure await is used here
  
    if (response && response.status === 200) {
      console.log('Transactions:', response.data);
      table.rows = response.data;
      table.page = params.page;
      table.perPage = params.perPage;
      table.totalRows = response.data.length;
      table.totalPage = Math.ceil(response.data.length / table.perPage);
    } else if (response && response.status === 401) {
      console.error('Unauthorized access - redirecting to login.');
      doLogout()
    } else {
      console.error('Failed to fetch transactions:', response);
    }
    
  } catch (e) {
    if (e.response && !e.handled) {
      e.handled = true
      alert('Something went wrong!')
    }
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

  return `Showing ${firstIndex} to ${lastIndex} of ${table.totalRows ?? 0} items`
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
            <div style="width: 80px;">
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
          <VTable class="text-no-wrap">
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
                { field: 'no', name: 'NO', sortable: true },                          // Assuming you have a 'no' field or you need to calculate it
                { field: 'name_cust', name: 'NAMA', sortable: true },
                { field: 'model_product', name: 'MODEL', sortable: true },
                { field: 'address_cust', name: 'ALAMAT', sortable: true },
                { field: 'no_hp_cust', name: 'NO TELP', sortable: true },
                { field: 'prov_cust', name: 'PROVINSI', sortable: true },
                { field: 'city_cust', name: 'KOTA/KAB', sortable: true },
                { field: 'instagram_cust', name: 'INSTAGRAM', sortable: true },
                { field: 'price_product', name: 'PEROLEHAN PRODUK TERJUAL', sortable: true }, // Assuming 'price_product' represents the sold product value
                { field: 'prov_cust', name: 'PROVINSI', sortable: true },  // Duplicate field name, maybe double-check this
                { field: 'actions', class: 'text-center' },
                ]"
              :order-by="table.orderBy"
              :dir="table.dir"
              @sort="doSort"
            />
          
            <!-- table body -->
            <tbody>
              <tr
                v-for="(row, index) in table.rows"
                :key="row.transaction_id"
              >
                <td>{{ index + 1 }}</td> <!-- Row number, if 'no' field is not present -->
                <td>{{ row.name_cust }}</td>
                <td>{{ row.model_product }}</td>
                <td>{{ row.address_cust }}</td>
                <td>{{ row.no_hp_cust }}</td>
                <td>{{ row.prov_cust }}</td>
                <td>{{ row.city_cust }}</td>
                <td>{{ row.instagram_cust }}</td>
                <td>{{ row.price_product }}</td>
                <td>{{ row.prov_cust }}</td> <!-- This is duplicated; consider reviewing this field -->
                <!-- Actions -->
                  <td class="text-center" style="width: 5rem;">
                    <VBtn
                      icon
                      size="x-small"
                      color="default"
                      variant="text"
                      @click="$router.push(`/transaction/detail/${row.transaction_id}`)"
                    >
                      <VIcon size="22" icon="tabler-list"/>
                    </VBtn>
                    <VBtn
                      icon
                      size="x-small"
                      color="default"
                      variant="text"
                      @click="$router.push(`/transaction/edit/${row.transaction_id}`)"
                    >
                      <VIcon size="22" icon="tabler-edit"/>
                    </VBtn>
                    <VBtn
                      icon
                      size="x-small"
                      color="default"
                      variant="text"
                      @click="doDelete(row)"
                    >
                      <VIcon size="22" icon="tabler-trash"/>
                    </VBtn>
                  </td>
              </tr>>
            </tbody>
          
            <!-- table footer -->
            <tfoot v-show="!table.rows.length">
              <tr>
                <td colspan="10" class="text-center">
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

<route lang="yaml">
meta:
  subject: Systems
  action: read
</route>
