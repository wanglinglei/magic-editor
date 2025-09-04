/**
 * 编辑器相关常量配置
 * 包含编辑器的基础配置、默认值和设置
 */

// 编辑器基础配置
export const DEFAULT_EDITOR_ID = 'magic-editor';

export const DEFAULT_EDITOR_CONTENT = '欢迎使用富文本编辑器！在这里开始编写你的内容...';

// 历史记录配置
export const DEFAULT_MAX_HISTORY_SIZE = 30;

// 自动保存配置
export const DEFAULT_AUTO_SAVE_INTERVAL = 1000;

// 编辑器样式相关常量
export const EDITOR_CLASSES = {
  container: 'magic-editor-container',
  toolbar: 'magic-editor-toolbar',
  content: 'magic-editor-content',
  button: 'magic-editor-button',
  active: 'magic-editor-button-active',
  disabled: 'magic-editor-button-disabled',
} as const;

// 编辑器事件类型
export const EDITOR_EVENTS = {
  contentChange: 'contentChange',
  selectionChange: 'selectionChange',
  focus: 'focus',
  blur: 'blur',
  beforeCommand: 'beforeCommand',
  afterCommand: 'afterCommand',
} as const;

// 编辑器状态
export const EDITOR_STATES = {
  idle: 'idle',
  editing: 'editing',
  loading: 'loading',
  error: 'error',
} as const;

// 快捷键配置
export const KEYBOARD_SHORTCUTS = {
  bold: 'Ctrl+B',
  italic: 'Ctrl+I',
  underline: 'Ctrl+U',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  save: 'Ctrl+S',
} as const;

// 文件导出相关常量
export const EXPORT_CONFIG = {
  defaultFileName: 'document.html',
  mimeType: 'text/html',
  encoding: 'UTF-8',
} as const;

// 编辑器限制配置
export const EDITOR_LIMITS = {
  maxContentLength: 100000, // 最大内容长度
  maxHistorySize: 50, // 最大历史记录数
  autoSaveDelay: 1000, // 自动保存延迟（毫秒）
} as const;
