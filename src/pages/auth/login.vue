<script setup>
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg'
import { themeConfig } from '@themeConfig'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { requiredValidator, emailValidator } from '@validators'
import jwtProvider from '@/auth/jwt/jwtProvider'
import authUtils from '@/auth/utils'

const router = useRouter()
const route = useRoute()

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

const doLogin = async () => {
  formState.loading = true
  try {
    const response = await jwtProvider.login({
      username: formData.username,
      password: formData.password,
    })

    const { userData, userPermissions, accessToken, refreshToken } = response.data.data

    jwtProvider.setAccessToken(accessToken)
    jwtProvider.setRefreshToken(refreshToken)
    authUtils.setUserData(userData)
    authUtils.setUserPermissions(userPermissions)
    if (formData.remember) {
      authUtils.setUser(formData.value.email)
    }

    router.replace(route.query.to ? String(route.query.to) : '/')
  } catch (e) {
    // api error
    if (e.response && !e.handled) {
      e.handled = true

      const { message } = e.response.data

      formErrors.form = message
      formErrors.username = ''
      formErrors.password = ''
    }

    // programm error
    if (!e.handled) {
      console.error('Something went wrong!', e)
    }

    // reset localstorage
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
                  :rules="[requiredValidator, emailValidator]"
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
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
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
</route>
