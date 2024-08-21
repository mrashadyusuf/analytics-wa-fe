<script setup>
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg'
import { themeConfig } from '@themeConfig'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { requiredValidator, emailValidator } from '@validators'
import jwtProvider from '@/auth/jwt/jwtProvider'
import authUtils from '@/auth/utils'
import { useAbility } from '@casl/vue'
import { initialAbility, parseAbility, firstMenu } from '@/plugins/casl/config'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const ability = useAbility()

const formRef = ref()

const formState = reactive({
  loading: false,
  isUserRemember: false,
  isPasswordVisible: false,
})

const formData = reactive({
  username: '',
  password: '',
})

const formErrors = reactive({
  form: '',
  username: '',
  password: '',
})

const onSubmit = () => {
  formRef.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      doLogin()
    }
  })
}

const userDt = { userData: { id: "99fccad8-4340-5025-96f5-c690aaeb1e75", username: "admin@demo.com", email: "admin@demo.com", fullname: "Administrator", avatar: "/src/assets/images/avatars/avatar-1.png", group_code: "admin", group_name: "Administrator" }, userPermissions: [ { id: "47d0cb66-7046-5005-9912-ff76f3bd9d77", group_code: "admin", group_name: "Administrator", function_id: "Dashboard", function_name: "Dashboard", read: "Y", create: "Y", update: "Y", delete: "Y", download: "Y" }, { id: "62297053-fe16-55fa-bbdb-f75bfd7c758c", group_code: "admin", group_name: "Administrator", function_id: "Systems", function_name: "System Master", read: "Y", create: "Y", update: "Y", delete: "Y", download: "Y" }, { id: "0eb29bff-8f97-5abd-9ef5-1bec7326b8b5", group_code: "admin", group_name: "Administrator", function_id: "Users", function_name: "Users", read: "Y", create: "Y", update: "Y", delete: "Y", download: "Y" }, { id: "f4d68ea9-324a-5200-8f39-51209730b141", group_code: "admin", group_name: "Administrator", function_id: "Groups", function_name: "Groups", read: "Y", create: "Y", update: "Y", delete: "Y", download: "Y" } ] };

const doLogin = async () => {
  formState.loading = true
  try {
    // Make API request to your backend
    const response = await axios.post('http://127.0.0.1:8000/auth/login', {
      username: formData.username,
      password: formData.password,
    })

    console.log("response", response)
    // You can use actual API response or mock data for demonstration
    const { userData, userPermissions } = userDt

    // Save token & refresh token
    jwtProvider.setAccessToken(response.data.access_token)
    jwtProvider.setRefreshToken(response.data.access_token)

    // Initialize user ability / permission
    const permissions = parseAbility(userPermissions)

    ability.update(permissions)
    authUtils.setUserPermissions(permissions)

    // Initialize user data
    const menu = firstMenu(permissions)

    authUtils.setUserData({
      fullname: "admin",
      email: "admin@gmail.com",
      group: userData.group_code,
      avatar: userData.avatar,
      homeRoute: menu.path,
    })

    router.replace(authUtils.getHomeRouteForLoggedInUser())
  } catch (e) {
    // API error handling
    if (e.response && !e.handled) {
      e.handled = true

      let message = e.response.data.detail || 'An error occurred'
      if (e.response.status === 401) {
        message = 'Invalid username or password'
      } else if (e.response.status === 500) {
        message = 'Internal server error'
      }

      formErrors.form = message
      formErrors.username = ''
      formErrors.password = ''
    }

    // Programmatic error handling
    if (!e.handled) {
      console.error('Something went wrong!', e)
    }

    // Reset local storage if needed
    jwtProvider.removeAccessToken()
    jwtProvider.removeRefreshToken()
    authUtils.removeUser()
    authUtils.removeUserData()
    authUtils.removeUserPermissions()
  }
  formState.loading = false
}


</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VImg
        :src="authV1TopShape"
        class="auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VImg
        :src="authV1BottomShape"
        class="auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card pa-4"
        max-width="448"
      >
        <VOverlay
          v-model="formState.loading"
          contained
          persistent
          scrim="#EAEAEA"
          class="align-center justify-center"
        >
          <VProgressCircular
            :size="50"
            indeterminate
            color="primary"
          />
        </VOverlay>
        <VCardItem class="justify-center">
          <template #prepend>
            <div class="d-flex">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
            </div>
          </template>

          <VCardTitle class="font-weight-bold text-h5 py-1">
            {{ themeConfig.app.title }}
          </VCardTitle>
        </VCardItem>

        <VCardText class="pt-1">
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText>

        <VCardSubtitle
          v-if="formErrors.form"
          class="v-error-message px-6 text-center"
        >
          {{ formErrors.form }}
        </VCardSubtitle>

        <VCardText>
          <VForm
            ref="formRef"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.username"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.username"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.password"
                  label="Password"
                  :type="formState.isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="formState.isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator]"
                  :error-messages="formErrors.password"
                  @click:append-inner="formState.isPasswordVisible = !formState.isPasswordVisible"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap mt-2 mb-4">
                  <VCheckbox
                    v-model="formState.isUserRemember"
                    label="Remember me"
                  />

                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    to="#"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>New on our platform?</span>
                <RouterLink
                  class="text-primary ms-2"
                  to="#"
                >
                  Create an account
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.v-error-message  {
  color: rgb(var(--v-theme-error));
}
</style>

<route lang="yaml">
meta:
  layout: blank
  redirectIfLoggedIn: true
  subject: Auth
  action: read
</route>
