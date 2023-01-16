<script setup>
import axios from '@axios'
import { requiredValidator } from '@validators'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const currentThemeName = vuetifyTheme.name.value
const swal = inject('$swal')
const router = useRouter()
const route = useRoute()

const formRef = ref()

const formState = reactive({
  loading: false,
})

const formData = reactive({
  id: null,
  category: '',
  subCategory: '',
  code: '',
  value: '',
})

const formErrors = reactive({
  category: '',
  subCategory: '',
  code: '',
  value: '',
})

onMounted(() => {
  doFind()
})

const doFind = async () => {
  formState.loading = true
  try {
    const params = { id: route.params.id }
    const response = await axios.get('/system-master/find', { params })
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

const onSubmit = () => {
  formRef.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      doSubmit()
    }
  })
}

const doSubmit = async () => {
  formState.loading = true
  try {
    const body = {
      id: formData.id,
      system_category: formData.category,
      system_sub_category: formData.subCategory,
      system_code: formData.code,
      system_value: formData.value,
    }

    await axios.put('/systems', body)

    swal.fire({
      icon: 'success',
      title: 'Data saved successfully',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    })
    router.push('/system-master')
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
          <VForm
            ref="formRef"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- category -->
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="formData.category"
                  label="Category"
                  placeholder="Category"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.category"
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
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.subCategory"
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
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.code"
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
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.value"
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex gap-4"
              >
                <VBtn type="submit">
                  Submit
                </VBtn>

                <VBtn
                  type="button"
                  color="secondary"
                  @click="$router.replace('/system-master')"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>