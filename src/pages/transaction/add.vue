<script setup>
import { ref, reactive, inject, watch } from 'vue'
import axiosInstance from '@/services/axiosInstance'
import { requiredValidator } from '@validators'
import { useRouter, useRoute } from 'vue-router'
import { doLogout } from '@/utils/authUtils'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { transactionChannels, productModels, provinces } from '@/data/dropdownData.js'; // Adjust the path if necessary

// Setup necessary functions and data
const swal = inject('$swal')
const router = useRouter()
const route = useRoute()

// Form reference
const formRef = ref()

// Form state management
const formState = reactive({
  loading: false,
})

// Setting today's date as default
const now = new Date(); // Get the current time in UTC
const utcPlus8 = new Date(now.getTime() + 8 * 60 * 60 * 1000); // Adjust time to UTC+8
const today = utcPlus8.toISOString(); // Format as ISO string

// Form data model
const formData = reactive({
  transaction_id: '',
  transaction_channel: '',
  model_product: '',
  price_product: '',
  no_hp_cust: '',
  name_cust: '',
  city_cust: '',
  prov_cust: '',
  address_cust: '',
  instagram_cust: '',
  created_by: 'SYSTEM',
  created_dt: today,  // Default to today's date
  updated_dt: today,  // Default to today's date
  updated_by: 'SYSTEM',
  transaction_dt: '',
  kuantitas_produk:''
})

// Form errors model
let formErrors = reactive({})
formErrors = reactive({
  transaction_dt: false,
});

const minDigitsValidator = value => {
  const isValid = value && value.length >= 10;
  return isValid || 'Phone number must have at least 10 digits';
};
// Letter-only validator
const lettersOnlyValidator = value => {
  const isValid = /^[A-Za-z\s]+$/.test(value);
  return isValid || 'Only letters allowed';
};
const noSpacesValidator = value => {
  const isValid = !/\s/.test(value);
  return isValid || 'No space allowed';
};
const validateForm = () => {
  if (!date.value) {
    formErrors.transaction_dt = true;
  } else {
    formErrors.transaction_dt = false;
  }
};

// Modal state
const errorModal = ref(false)
const errorMessage = ref('')


// Method for form submission
const onSubmit = () => {
  validateForm()
  formRef.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      doSubmit()
    }
  })
}

// Method to handle the form submission logic
const doSubmit = async () => {
  formState.loading = true
  try {
    const body = {
      transaction_id: formData.transaction_id,
      transaction_channel: formData.transaction_channel,
      model_product: formData.model_product,
      price_product: formData.price_product,
      no_hp_cust: formData.no_hp_cust,
      name_cust: formData.name_cust,
      city_cust: formData.city_cust,
      prov_cust: formData.prov_cust,
      address_cust: formData.address_cust,
      instagram_cust: formData.instagram_cust,
      created_by: formData.created_by,
      created_dt: formData.created_dt,
      updated_by: formData.updated_by,
      updated_dt: formData.updated_dt,
      transaction_dt: formData.transaction_dt,
      kuantitas: formData.kuantitas_produk
      
    }

    let response = await createTransaction(body);

    if (response && response.status === 200) {
      swal.fire({
        icon: 'success',
        title: 'Transaction saved successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      })
      router.push('/transaction')
    } else {
      if(response && response.status === 401){
        console.error('Unauthorized access - redirecting to login.');
        // Display an error message
        errorMessage.value = 'Unauthorized access. You will be logged out in 3 seconds.';
        errorModal.value = true;

        // Wait for 3 seconds before logging out
        setTimeout(() => {
          doLogout(router, route);
        }, 3000); // 3000 milliseconds = 3 seconds
        return;
      } else {
        errorMessage.value = response.data?.message || 'Failed to create transaction.';
        errorModal.value = true;
      }
    }
  } catch (e) {
    if (e.response && !e.handled) {
      e.handled = true
      errorMessage.value = 'Something went wrong while creating the transaction.';
      errorModal.value = true;
    }
  } finally {
    formState.loading = false
  }
}
// Date picker
const date = ref(null);
const formattedDate = ref('');

// Watch the date to auto-update the formatted display and the formData
watch(date, (newDate) => {
  if (newDate) {
    formattedDate.value = new Date(newDate).toISOString().split('T')[0];
    formData.transaction_dt = formattedDate.value;
  }
});

const updateTransactionDate = (newDate) => {
  date.value = new Date(newDate).toISOString().split('T')[0];
  validateForm(); // Validate the form when the date is updated
};

const createTransaction = async (body) => {
  const response = await axiosInstance.post('/transactions/', body)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log("error response", error.response);  // Log the error response
      return error.response;
    });
  return response;
}

</script>

<template>
  <VCard title="Create Transaction">
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
        <VCol cols="12" md="6">
          <VForm
            ref="formRef"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <VRow>              
              <!-- Kanal Transaksi -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="formData.transaction_channel"
                  :items="transactionChannels"
                  label="Kanal Transaksi"
                  placeholder="Kanal Transaksi"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.transaction_channel"
                />
              </VCol>
              
              <!-- Model Produk -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="formData.model_product"
                  :items="productModels"
                  label="Model Produk"
                  placeholder="Model Produk"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.model_product"
                />
              </VCol>
              
              <!-- Kuantitas Produk -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.kuantitas_produk"
                  label="Kuantitas Produk"
                  placeholder="Kuantitas Produk"
                  type="number"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.kuantitas_produk"
                />
              </VCol>              
                            
              <!-- Harga Produk -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.price_product"
                  label="Harga Produk"
                  placeholder="Harga Produk"
                  type="number"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.price_product"
                />
              </VCol>
              
              <!-- Nomor Telepon Pelanggan -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.no_hp_cust"
                  label="Nomor Telepon Pelanggan"
                  placeholder="Nomor Telepon Pelanggan"
                  type="number"
                  :rules="[requiredValidator, minDigitsValidator]"
                  :error-messages="formErrors.no_hp_cust"
                />
              </VCol>
              
              <!-- Nama Pelanggan -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.name_cust"
                  label="Nama Pelanggan"
                  placeholder="Nama Pelanggan"
                  :rules="[requiredValidator,lettersOnlyValidator]"
                  :error-messages="formErrors.name_cust"
                />
              </VCol>
              
              <!-- Kota Pelanggan -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.city_cust"
                  label="Kota Pelanggan"
                  placeholder="Kota Pelanggan"
                  :rules="[requiredValidator, lettersOnlyValidator]"
                  :error-messages="formErrors.city_cust"
                />
              </VCol>
              
              <!-- Provinsi Pelanggan -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="formData.prov_cust"
                  :items="provinces"
                  label="Provinsi Pelanggan"
                  placeholder="Provinsi Pelanggan"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.prov_cust"
                />
              </VCol>
              
              <!-- Alamat Pelanggan -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.address_cust"
                  label="Alamat Pelanggan"
                  placeholder="Alamat Pelanggan"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.address_cust"
                />
              </VCol>
              
              <!-- Instagram Pelanggan -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.instagram_cust"
                  label="Instagram Pelanggan"
                  placeholder="Instagram Pelanggan"
                  :error-messages="formErrors.instagram_cust"
                  :rules="[noSpacesValidator]"
                />
              </VCol>

              <!-- Tanggal Transaksi -->
              <VCol cols="12">
                <label for="transaction-date-picker" class="form-label">Tanggal Transaksi</label>
                <VueDatePicker
                  id="transaction-date-picker"
                  v-model="date"
                  :type="'date'"
                  :format="'dd-MM-yyyy'"
                  @update:model-value="updateTransactionDate"
                  :max-date="new Date().setHours(23, 59, 59, 59)"
                />
                <!-- Error Message -->
                <span v-if="formErrors.transaction_dt" class="error-message-custom">
                  This field is required
                </span>
              </VCol>
        
              <VCol cols="12" class="d-flex gap-4">
                <VBtn type="submit">
                  Submit
                </VBtn>

                <VBtn type="button" color="secondary" @click="$router.push('/transaction')">
                  Back
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCol>
      </VRow>
    </VCardText>

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
  </VCard>
</template>

<style>
  .error-message-custom{
    font-size: 0.75rem;
    font-weight: 400;
    grid-area: s;
    letter-spacing: 0.0333333333em;
    color: rgb(var(--v-theme-error));
    margin-left: 15px;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>
<route lang="yaml">
  meta:
    subject: 'Systems'
    action: 'add'
</route>
