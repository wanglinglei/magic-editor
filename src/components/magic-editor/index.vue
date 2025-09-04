<template>
  <div class="editor-container" :style="style">
    <div class="editor-header">
      <div
        class="flex-start flex-wrap p-10px rounded-6px border-gray-200 border-solid border-b-1px"
      >
        <div
          class="flex-start p-y-5px px-x-10px borderGray mx-10px rounded-6px"
          :class="{
            'border-r-gray-200': index !== operatorConfigs.length - 1,
          }"
          v-for="(group, index) in operatorConfigs"
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
      <p>{{ defaultContent }}</p>
    </div>

    <!-- 状态栏 -->
    <div class="flex-between">
      <span id="wordCount">字数: 0</span>
      <span id="charCount">字符数: 0</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, defineEmits, nextTick } from 'vue';
import type { EditorProps } from './types/component';
import { RichTextEditor } from './lib/RichTextEditor';
import {
  DEFAULT_EDITOR_CONTENT,
  DEFAULT_EDITOR_OPERATORS,
  DEFAULT_EDITOR_ID,
} from './constants/config';

const {
  style,
  editorId = DEFAULT_EDITOR_ID,
  operators = [],
  defaultContent = DEFAULT_EDITOR_CONTENT,
  maxHistorySize,
  autoSaveInterval,
} = defineProps<EditorProps>();

const operatorConfigs = computed(() => {
  return operators.map((group) => {
    return group.map((item) => {
      // 处理两种情况：字符串或对象
      return DEFAULT_EDITOR_OPERATORS[item as keyof typeof DEFAULT_EDITOR_OPERATORS];
    });
  });
});

// 计算支持的命令列表
const supportedCommands = computed(() => {
  const commands: string[] = [];
  operators.forEach((group) => {
    group.forEach((item) => {
      // 处理两种情况：字符串或对象
      if (!commands.includes(item)) {
        commands.push(item);
      }
    });
  });
  return commands;
});

let richTextEditor: RichTextEditor | null = null;
const emit = defineEmits(['ready']);

onMounted(() => {
  richTextEditor = new RichTextEditor({
    editorId,
    maxHistorySize,
    autoSaveInterval,
    supportedCommands: supportedCommands.value,
  });
  nextTick(() => {
    emit('ready');
  });
});

const getContent = () => {
  return richTextEditor?.getContent();
};

defineExpose({
  getContent,
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
