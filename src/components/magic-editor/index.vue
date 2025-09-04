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
import { onMounted, computed } from 'vue';
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

onMounted(() => {
  console.log('=== 编辑器初始化开始 ===');
  console.log('编辑器ID:', editorId);
  console.log('支持的命令:', supportedCommands.value);
  console.log('历史记录配置:', { maxHistorySize, autoSaveInterval });

  const richTextEditor = new RichTextEditor({
    editorId,
    maxHistorySize,
    autoSaveInterval,
    supportedCommands: supportedCommands.value,
  });

  // 将编辑器实例暴露到全局，方便调试
  (window as unknown as Record<string, unknown>).richTextEditor = richTextEditor;

  // 调试信息
  setTimeout(() => {
    console.log('=== 编辑器初始化完成 ===');
    const historyManager = richTextEditor.getHistoryManager();
    const historyStatus = historyManager.getStatus();

    console.log('历史记录状态:', historyStatus);
    console.log('历史记录是否启用:', historyStatus.enabled);
    console.log('可以撤销:', richTextEditor.canUndo());
    console.log('当前内容:', richTextEditor.getContent());
    console.log('历史记录详情:', historyManager.getAllRecords());

    // 如果历史记录没有启用，强制启用并测试
    if (!historyStatus.enabled) {
      console.log('⚠️ 历史记录未启用，尝试强制启用...');
      // 手动设置启用状态
      historyManager.setEnabled(true);
      console.log('强制启用后状态:', historyManager.getStatus());
    }

    // 测试手动保存一条记录
    console.log('=== 测试手动保存历史记录 ===');
    richTextEditor.saveToHistoryNow();

    setTimeout(() => {
      const newStatus = historyManager.getStatus();
      console.log('保存后的历史记录状态:', newStatus);
      console.log('现在可以撤销:', richTextEditor.canUndo());

      // 如果还是不行，尝试直接调用历史管理器
      if (newStatus.totalRecords === 0) {
        console.log('🔧 直接调用历史管理器保存...');
        const content = richTextEditor.getContent();
        historyManager.forceSave(content);

        setTimeout(() => {
          const finalStatus = historyManager.getStatus();
          console.log('直接保存后状态:', finalStatus);
        }, 100);
      }
    }, 100);
  }, 1000);
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
