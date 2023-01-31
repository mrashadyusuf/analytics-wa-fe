<script setup>
import axios from '@axios'

const router = useRouter()
const route = useRoute()

const formState = reactive({
  loading: false,
})

const formData = reactive({
  id: null,
  category: null,
  subCategory: null,
  code: null,
  value: null,
})

onMounted(() => {
  doFind()
})

const doFind = async () => {
  formState.loading = true
  try {
    const params = { id: route.params.id }
    const response = await axios.get('/systems/find', { params })
    const { data } = response.data

    formData.id = data.id
    formData.category = data.system_category
    formData.subCategory = data.system_sub_category
    formData.code = data.system_code
    formData.value = data.system_value
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
  formState.loading = false
}

const doCancel = () => {
  router.replace('/system-master')
}
</script>

<template>
  <VCard title="System Master Add">
    <VCardText>
      <VOverlay
        v-model="formState.loading"
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
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VForm autocomplete="off">
            <VRow>
              <!-- category -->
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="formData.category"
                  label="Category"
                  placeholder="Category"
                  disabled
                />
              </VCol>

              <!-- sub category -->
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="formData.subCategory"
                  label="Sub Category"
                  placeholder="Sub Category"
                  disabled
                />
              </VCol>

              <!-- system code -->
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="formData.code"
                  label="Code"
                  placeholder="Code"
                  disabled
                />
              </VCol>

              <!-- value -->
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="formData.value"
                  label="Value"
                  placeholder="Value"
                  disabled
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex gap-4"
              >
                <VBtn
                  type="button"
                  color="secondary"
                  @click="doCancel"
                >
                  Back
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<route lang="yaml">
meta:
  subject: Systems
  action: read
</route>
