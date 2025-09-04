<template>
  <div class="text-20px font-bold text-center p-20px">magic editor</div>
  <MagicEditor :operators="operators" />
</template>
<script setup lang="ts">
import MagicEditor from './components/magic-editor/index.vue';
// import { DEFAULT_EDITOR_OPERATORS } from './components/magic-editor/constants/config';
const operators = [
  ['undo', 'reset', 'clear'],
  ['blod', 'italic', 'underline', 'strikeThrough'],
  ['export'],
];
</script>
<style scoped></style>
