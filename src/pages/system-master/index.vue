<script setup>
import axios from '@axios'
import { useTheme } from 'vuetify'

const swal = inject('$swal')
const vuetifyTheme = useTheme()

const loading = ref(false)
const searchCategory = ref('')
const perPage = ref(10)
const page = ref(1)
const totalPage = ref(1)
const totalRows = ref(0)
const items = ref([])

onMounted(() => {
  doSearch({ reload: true })
})

const doSearch = async options => {
  loading.value = true
  try {
    const params = {
      keyword: searchCategory.value,
      page: options?.reload ? 1 : page.value,
      perPage: perPage.value,
    }

    const response = await axios.get('/systems', { params })
    const { data } = response.data

    items.value = data
    page.value = params.page
    perPage.value = params.perPage
    totalRows.value = response.headers['total-rows']
    totalPage.value = response.headers['total-page']
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
  loading.value = false
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

// Computing pagination data
const paginationData = computed(() => {
  const firstIndex = items.value.length ? (page.value - 1) * perPage.value + 1 : 0
  const lastIndex = items.value.length + (page.value - 1) * perPage.value
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalRows.value ?? 0 } items`
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
                    v-model="searchCategory"
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
                v-model="perPage"
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
              v-model="loading"
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
            <thead>
              <tr>
                <th scope="col">
                  CATEGORY
                </th>
                <th scope="col">
                  SUB CATEGORY
                </th>
                <th scope="col">
                  CODE
                </th>
                <th scope="col">
                  VALUE
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <!-- table body -->
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
              >
                <!-- category -->
                <td>
                  <span class="text-base">{{ item.system_category }}</span>
                </td>

                <!-- sub category -->
                <td>
                  <span class="text-base">{{ item.system_sub_category }}</span>
                </td>

                <!-- code -->
                <td>
                  <span class="text-base">{{ item.system_code }}</span>
                </td>

                <!-- value -->
                <td>
                  <span class="text-base">{{ item.system_value }}</span>
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
                    @click="$router.push(`/system-master/detail/${item.id}`)"
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
                    @click="$router.push(`/system-master/edit/${item.id}`)"
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
                    @click="doDelete(item)"
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
            <tfoot v-show="!items.length">
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
              {{ paginationData }}
            </span>

            <VPagination
              v-model="page"
              size="small"
              :total-visible="5"
              :length="totalPage"
              @update:model-value="doSearch"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>
