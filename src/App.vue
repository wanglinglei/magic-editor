<template>
  <div class="text-20px font-bold text-center p-20px">magic editor</div>
  <MagicEditor :operators="DEFAULT_EDITOR_OPERATORS" />
</template>
<script setup lang="ts">
import MagicEditor from './components/magic-editor/index.vue';
import { DEFAULT_EDITOR_OPERATORS } from './components/magic-editor/constants/config';
</script>
<style scoped></style>
