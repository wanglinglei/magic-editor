<template>
  <div class="editor-container">
    <div class="editor-header">
      <div
        class="flex-start flex-wrap p-10px rounded-6px border-gray-200 border-solid border-b-1px"
      >
        <div
          class="flex-start p-y-5px px-x-10px borderGray mx-10px rounded-6px"
          :class="{
            'border-r-gray-200': index !== operators.length - 1,
          }"
          v-for="(group, index) in operators"
          :key="index"
        >
          <div
            class="commond-button flex-center p-x-10px hover:text-blue-500 cursor-pointer"
            :class="{
              'border-r-gray-200': index !== group.length - 1,
            }"
            :data-command="item.type"
            v-for="(item, index) in group"
            :key="index"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑器内容区域 -->
    <div class="editor-content borderGray" :id="editorId" contenteditable="true" spellcheck="false">
      <p>欢迎使用富文本编辑器！在这里开始编写你的内容...</p>
    </div>

    <!-- 状态栏 -->
    <div class="flex-between">
      <span id="wordCount">字数: 0</span>
      <span id="charCount">字符数: 0</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { EditorProps } from './types/component'
import { RichTextEditor } from './lib/RichTextEditor'
import { DEFAULT_EDITOR_ID } from './constants/config'

const { style, editorId = DEFAULT_EDITOR_ID, operators = [] } = defineProps<EditorProps>()

onMounted(() => {
  const richTextEditor = new RichTextEditor({ editorId, operators })
})
</script>

<style lang="less" scoped>
@import './style.less';
</style>
