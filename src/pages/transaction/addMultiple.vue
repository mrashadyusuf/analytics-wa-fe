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
const transactions = reactive([{
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
  created_dt: today,
  updated_dt: today,
  updated_by: 'SYSTEM',
  transaction_dt: '',
  kuantitas_produk: ''
}]);

// Function to add a new transaction form
const addTransaction = () => {
  transactions.push({
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
    created_dt: today,
    updated_dt: today,
    updated_by: 'SYSTEM',
    transaction_dt: '',
    kuantitas_produk: ''
  });
};

// Function to remove a transaction
const removeTransaction = (index) => {
  if (transactions.length > 1) {
    transactions.splice(index, 1);
  } else {
    swal.fire({
      icon: 'warning',
      title: 'At least one transaction is required',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
  }
};


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
  formState.loading = true;
  try {
    console.log("transactions",transactions)
    const body = transactions.map(transaction => ({
      transaction_channel: transaction.transaction_channel,
      model_product: transaction.model_product,
      price_product: transaction.price_product,
      no_hp_cust: transaction.no_hp_cust,
      name_cust: transaction.name_cust,
      city_cust: transaction.city_cust,
      prov_cust: transaction.prov_cust,
      address_cust: transaction.address_cust,
      instagram_cust: transaction.instagram_cust,
      created_by: transaction.created_by,
      created_dt: transaction.created_dt,
      updated_by: transaction.updated_by,
      updated_dt: transaction.updated_dt,
      transaction_dt: transaction.transaction_dt.toISOString().split('T')[0],
      kuantitas: transaction.kuantitas_produk,
    }));

    let response = await createBatchTransaction(body);

    if (response && response.status === 200) {
      swal.fire({
        icon: 'success',
        title: 'Transactions saved successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      router.push('/transaction');
    } else {
      handleErrorResponse(response); // Handle errors
    }
  } catch (error) {
    handleGeneralError(error); // Handle general errors
  } finally {
    formState.loading = false;
  }
};

const handleErrorResponse = (response) => {
  if (response && response.status === 401) {
    errorMessage.value = 'Unauthorized access. You will be logged out in 3 seconds.';
    errorModal.value = true;

    // Wait for 3 seconds before logging out
    setTimeout(() => {
      doLogout(router, route);
    }, 3000);
  } else {
    errorMessage.value = response.data?.message || 'Failed to create transactions.';
    errorModal.value = true;
  }
};

const handleGeneralError = (error) => {
  if (error.response && !error.handled) {
    error.handled = true;
    errorMessage.value = 'Something went wrong while creating the transactions.';
    errorModal.value = true;
  } else {
    console.error("Unexpected error occurred:", error);
  }
};

// Create batch transaction API call
const createBatchTransaction = async (body) => {
  const response = await axiosInstance.post('/transactions/group', body)
    .then(res => res)
    .catch(error => {
      console.log("error response", error.response);  // Log the error response
      return error.response;
    });
  return response;
};


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
  <VCard title="Create Batch Transactions">
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

      <VForm ref="formRef" autocomplete="off" @submit.prevent="onSubmit">
        <!-- Iterate over the transactions array and render a form for each transaction -->
        <div class="v-row">
          <div v-for="(transaction, index) in transactions" :key="index" class="transaction-form v-col-md-6 v-col-6" >
            <VRow>
              <VCol cols="12" md="12">
                <VAutocomplete
                  v-model="transaction.transaction_channel"
                  :items="transactionChannels"
                  label="Kanal Transaksi"
                  placeholder="Kanal Transaksi"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12" md="12">
                <VAutocomplete
                  v-model="transaction.model_product"
                  :items="productModels"
                  label="Model Produk"
                  placeholder="Model Produk"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12" md="12">
                <VTextField
                  v-model="transaction.kuantitas_produk"
                  label="Kuantitas Produk"
                  type="number"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12" md="12">
                <VTextField
                  v-model="transaction.price_product"
                  label="Harga Produk"
                  type="number"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12" md="12">
                <VTextField
                  v-model="transaction.no_hp_cust"
                  label="Nomor Telepon Pelanggan"
                  type="number"
                  :rules="[requiredValidator, minDigitsValidator]"
                />
              </VCol>

              <VCol cols="12" md="12">
                <VTextField
                  v-model="transaction.name_cust"
                  label="Nama Pelanggan"
                  :rules="[requiredValidator, lettersOnlyValidator]"
                />
              </VCol>


              <VCol cols="12" md="12">
                <VAutocomplete
                  v-model="transaction.prov_cust"
                  :items="provinces"
                  label="Provinsi Pelanggan"
                  placeholder="Provinsi Pelanggan"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12" md="12">
                <VTextField
                  v-model="transaction.city_cust"
                  label="Kota Pelanggan"
                  :rules="[requiredValidator, lettersOnlyValidator]"
                />
              </VCol>
              <VCol cols="12" md="12">
                <VTextField
                  v-model="transaction.address_cust"
                  label="Alamat Pelanggan"
                  placeholder="Alamat Pelanggan"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.address_cust"
                />
              </VCol>
                <!-- Instagram Pelanggan -->
                <VCol cols="12" md="12">
                  <VTextField
                  v-model="transaction.instagram_cust"
                  label="Instagram Pelanggan"
                  placeholder="Instagram Pelanggan"
                  :error-messages="formErrors.instagram_cust"
                  :rules="[noSpacesValidator]"
                />
              </VCol>
              <VCol cols="12" md="12">
                <VueDatePicker
                  v-model="transaction.transaction_dt"
                  :type="'date'"
                  :format="'dd-MM-yyyy'"
                  :max-date="new Date().setHours(23, 59, 59, 59)"
                />
              </VCol>

              <!-- Remove Transaction Button -->
              <VCol cols="12">
                <VBtn color="error" @click="removeTransaction(index)">
                  Remove Transaction
                </VBtn>
                                <!-- Button to Add More Transactions -->
                  <VBtn type="button" color="primary" @click="addTransaction">
                    Add Transaction
                  </VBtn>
              </VCol>
            </VRow>

            <!-- Divider between transactions -->
            <!-- <VCol cols="12">
              <hr />
            </VCol> -->
          </div>
        </div>

        <!-- Submit Button -->
        <VBtn type="submit" color="success">
          Submit All Transactions
        </VBtn>
      </VForm>
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
  .transaction-form {
    border: 1px solid #e0e0e0;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  
</style>
<route lang="yaml">
  meta:
    subject: 'Systems'
    action: 'add'
</route>
