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

const getTransactions = async (offset = 0, limit = 10,keyword) => {
  console.log("keyword",keyword)

  const response = await axiosInstance.get('transactions/', {
    params: {
      offset: offset,
      limit: limit,
      search:keyword
    }
  })
  .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log("error response", error.response);  // Log the error response
      return error.response;
    });
  return response;
}

// Modal state
const errorModal = ref(false)
const errorMessage = ref('')

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

    const response = await getTransactions((params.page - 1) * params.perPage, params.perPage,params.keyword) // Pass params here
  
    if (response && response.status === 200) {
      table.rows = response.data.transactions;
      table.page = Math.floor(response.data.offset / params.perPage) + 1;
      table.perPage = params.perPage;
      table.totalRows = response.data.total_all_data;
      table.totalPage = Math.ceil(response.data.total_all_data / table.perPage);
    } else if (response && response.status === 401) {
      console.error('Unauthorized access - redirecting to login.');
      errorMessage.value = 'Unauthorized access. You will be logged out in 3 seconds.';
      errorModal.value = true;

      setTimeout(() => {
        doLogout(router, route)
      }, 3000);    
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
    html: `Are you sure you want to delete this transaction?<br/>This action cannot be undone.`,
    focusCancel: true,
    showCancelButton: true,
    showConfirmButton: true,
    showLoaderOnConfirm: true,
    confirmButtonText: '<i class="ti ti-trash-x"></i> Delete',
    confirmButtonColor: vuetifyTheme.themes.value[currentThemeName].colors.error,
    cancelButtonColor: vuetifyTheme.themes.value[currentThemeName].colors.secondary,
    preConfirm: async () => {
      try {
        // Assuming the transaction_id is passed in item.transaction_id
        const response = await axiosInstance.delete(`/transactions/${item.transaction_id}`);
        if (response.status == 200){
          swal.fire({
          icon: 'success',
          title: 'Delete transaction successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
      })
        }
        return true;  // Indicate success
      } catch (e) {
        // Handle API errors
        if (e.response && !e.handled) {
          e.handled = true;
          alert('Something went wrong!');
        }

        // Handle any other errors
        if (!e.handled) {
          console.log(e);
        }

        return false;  // Indicate failure
      }
    },
  }).then(result => {
    // If the deletion was successful, refresh the data
    if (result.value) {
      doSearch();
    }
  });
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

const formatCurrency=(value) => {
    let val = (value/1).toFixed(0).replace('.', ',')
    return `${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
}
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Transaction">
            <!-- search filter -->
          <VCardText>
            <VRow>
              <VCol cols="12">
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
                to="/transaction/add"
              >
                Add
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <!-- Transactions Table -->
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
          
            <CTableHeaderSortable 
              :headers="[
                { field: 'no', name: 'No', class: 'text-center' },
                { field: 'transaction_id', name: 'ID Transaksi', class: 'text-center' },
                { field: 'name_cust', name: 'Nama', class: 'text-center' },
                { field: 'model_product', name: 'Model', class: 'text-center' },
                { field: 'kuantitas', name: 'Kuantitas', class: 'text-center' },
                { field: 'price_product', name: 'Harga', class: 'text-center harga-column' },
                { field: 'address_cust', name: 'Alamat', class: 'text-center' },
                { field: 'no_hp_cust', name: 'No Telp', class: 'text-center' },
                { field: 'prov_cust', name: 'Provinsi', class: 'text-center' },
                { field: 'city_cust', name: 'Kota/Kab', class: 'text-center' },
                { field: 'instagram_cust', name: 'Instagram', class: 'text-center' },
                { field: 'actions', name: 'Actions', class: 'text-center' },               
              ]"
              :order-by="table.orderBy"
              :dir="table.dir"
              @sort="doSort"
            />

            <!-- Table Body -->
            <tbody>
              <tr
                v-for="(row, index) in table.rows"
                :key="row.transaction_id"
              >
                <td style="text-align: center;">{{ index + 1 }}</td> <!-- Row number -->
                <td style="text-align: center;">{{ row.transaction_id }}</td>
                <td style="text-align: center;">{{ row.name_cust }}</td>
                <td style="text-align: center;">{{ row.model_product }}</td>
                <td style="text-align: center;">{{ row.kuantitas }}</td>
                <td style="text-align: right; position: relative;">
                  <span style="position: absolute; left: 10px;">Rp</span>
                  <span>{{ formatCurrency(row.price_product) }}</span>                
                </td>
                <td>{{ row.address_cust }}</td>
                <td style="text-align: center;">{{ row.no_hp_cust }}</td>
                <td style="text-align: center;">{{ row.prov_cust }}</td>
                <td style="text-align: center;">{{ row.city_cust }}</td>
                <td style="text-align: center;">{{ row.instagram_cust }}</td>
                <!-- Actions -->
                <td class="text-center" style="width: 5rem;">
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
              </tr>
            </tbody>

            <!-- Table Footer -->
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

    <!-- Error Modal -->
    <VDialog v-model="errorModal" max-width="500">
      <VCard>
        <VCardTitle class="headline">Error</VCardTitle>
        <VCardText>{{ errorMessage }}</VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="primary" text @click="errorModal = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

  </section>
</template>
<style>
.harga-column {
  min-width: 120px; /* Adjust the value as needed */
  text-align: center;
}
</style>

<route lang="yaml">
meta:
  subject: Systems
  action: read
</route>
