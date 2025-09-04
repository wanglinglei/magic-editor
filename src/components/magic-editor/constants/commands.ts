/**
 * 命令相关常量配置
 * 包含所有命令的配置信息、类型定义和属性设置
 */

// 格式化属性配置
export const PROPERTY = {
  blod: {
    tagName: 'b',
    styleProperty: 'font-weight',
    styleValue: 'bold',
  },
  italic: {
    tagName: 'i',
    styleProperty: 'font-style',
    styleValue: 'italic',
  },
  underline: {
    tagName: 'u',
    styleProperty: 'text-decoration',
    styleValue: 'underline',
  },
  strikeThrough: {
    tagName: 's',
    styleProperty: 'text-decoration',
    styleValue: 'line-through',
  },
} as const;

// 内容操作命令配置
export const DEFAULT_CONTENT_COMMANDS_CONFIG = {
  reset: {
    type: 'reset',
    operatorType: 'default',
    label: '重置',
  },
  undo: {
    type: 'undo',
    operatorType: 'default',
    label: '撤销',
  },
  clear: {
    type: 'clear',
    operatorType: 'default',
    label: '清空',
  },
} as const;

// 格式化命令配置
export const DEFAULT_FORMAT_COMMANDS_CONFIG = {
  blod: {
    type: 'blod',
    operatorType: 'default',
    label: '粗体',
  },
  italic: {
    type: 'italic',
    operatorType: 'default',
    label: '斜体',
  },
  underline: {
    type: 'underline',
    operatorType: 'default',
    label: '下划线',
  },
  strikeThrough: {
    type: 'strikeThrough',
    operatorType: 'default',
    label: '删除线',
  },
} as const;

// 导出命令配置
export const DEFAULT_EXPORT_COMMANDS_CONFIG = {
  export: {
    type: 'export',
    operatorType: 'default',
    label: '导出',
  },
} as const;

// 命令类型定义
export const CONTENT_COMMANDS = ['reset', 'undo', 'clear'] as const;
export const FORMAT_COMMANDS = ['blod', 'italic', 'underline', 'strikeThrough'] as const;
export const EXPORT_COMMANDS = ['export'] as const;
export const LIST_COMMANDS = ['orderedList', 'unorderedList'] as const;

// 所有命令的集合
export const ALL_COMMANDS = [
  ...CONTENT_COMMANDS,
  ...FORMAT_COMMANDS,
  ...EXPORT_COMMANDS,
  ...LIST_COMMANDS,
] as const;

// 命令类型检查函数
export function isContentCommand(command: string): command is (typeof CONTENT_COMMANDS)[number] {
  return CONTENT_COMMANDS.includes(command as (typeof CONTENT_COMMANDS)[number]);
}

export function isFormatCommand(command: string): command is (typeof FORMAT_COMMANDS)[number] {
  return FORMAT_COMMANDS.includes(command as (typeof FORMAT_COMMANDS)[number]);
}

export function isListCommand(command: string): command is (typeof LIST_COMMANDS)[number] {
  return LIST_COMMANDS.includes(command as (typeof LIST_COMMANDS)[number]);
}
