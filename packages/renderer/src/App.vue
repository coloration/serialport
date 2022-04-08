<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import config from '../../../electron-builder.json'

useTitle(config.productName)

</script>

<template>
<router-view />
</template>

<style>
html, body, #app {
  height: 100%;
}
</style>
