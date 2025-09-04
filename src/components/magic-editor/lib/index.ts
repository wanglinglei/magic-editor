// 主要类
export { RichTextEditor } from './RichTextEditor';
export { Command } from './command';
export { HistoryManager } from './history';

// 配置工具
export {
  EditorPresets,
  EditorConfigBuilder,
  validateEditorConfig,
  createEditorConfig,
} from './config-helper';

// 命令系统
export * from './commands';

// 类型定义
export type { HistoryConfig, HistoryRecord } from './history';
