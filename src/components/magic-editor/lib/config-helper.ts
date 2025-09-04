import type { RichTextEditorOptions } from '../types';

/**
 * 预定义的编辑器配置
 */
export const EditorPresets = {
  /**
   * 基础配置 - 只有格式化功能，不包含历史记录
   */
  basic: (): RichTextEditorOptions => ({
    supportedCommands: ['blod', 'italic', 'underline', 'strikeThrough', 'reset', 'clear'],
  }),

  /**
   * 标准配置 - 包含格式化和历史记录功能
   */
  standard: (): RichTextEditorOptions => ({
    maxHistorySize: 30,
    autoSaveInterval: 1000,
    supportedCommands: ['blod', 'italic', 'underline', 'strikeThrough', 'undo', 'reset', 'clear'],
  }),

  /**
   * 高级配置 - 包含所有功能
   */
  advanced: (): RichTextEditorOptions => ({
    maxHistorySize: 50,
    autoSaveInterval: 500,
    supportedCommands: [
      'blod',
      'italic',
      'underline',
      'strikeThrough',
      'undo',
      'reset',
      'clear',
      'orderedList',
      'unorderedList',
    ],
  }),

  /**
   * 性能优先配置 - 较少的历史记录，较长的保存间隔
   */
  performance: (): RichTextEditorOptions => ({
    maxHistorySize: 15,
    autoSaveInterval: 2000,
    supportedCommands: ['blod', 'italic', 'underline', 'strikeThrough', 'undo', 'reset'],
  }),

  /**
   * 移动端配置 - 优化移动设备性能
   */
  mobile: (): RichTextEditorOptions => ({
    maxHistorySize: 10,
    autoSaveInterval: 1500,
    supportedCommands: ['blod', 'italic', 'undo', 'reset'],
  }),
};

/**
 * 配置构建器 - 提供链式调用的配置方式
 */
export class EditorConfigBuilder {
  private config: RichTextEditorOptions = {};

  /**
   * 设置编辑器ID
   */
  setEditorId(editorId: string): EditorConfigBuilder {
    this.config.editorId = editorId;
    return this;
  }

  /**
   * 设置历史记录最大数量
   */
  setMaxHistorySize(size: number): EditorConfigBuilder {
    this.config.maxHistorySize = size;
    return this;
  }

  /**
   * 设置自动保存间隔
   */
  setAutoSaveInterval(interval: number): EditorConfigBuilder {
    this.config.autoSaveInterval = interval;
    return this;
  }

  /**
   * 设置支持的命令
   */
  setSupportedCommands(commands: string[]): EditorConfigBuilder {
    this.config.supportedCommands = [...commands];
    return this;
  }

  /**
   * 添加命令到支持列表
   */
  addCommand(command: string): EditorConfigBuilder {
    if (!this.config.supportedCommands) {
      this.config.supportedCommands = [];
    }
    if (!this.config.supportedCommands.includes(command)) {
      this.config.supportedCommands.push(command);
    }
    return this;
  }

  /**
   * 添加多个命令到支持列表
   */
  addCommands(commands: string[]): EditorConfigBuilder {
    commands.forEach((cmd) => this.addCommand(cmd));
    return this;
  }

  /**
   * 启用格式化命令
   */
  enableFormatting(): EditorConfigBuilder {
    return this.addCommands(['blod', 'italic', 'underline', 'strikeThrough']);
  }

  /**
   * 启用历史记录功能
   */
  enableHistory(maxSize = 30, autoSaveInterval = 1000): EditorConfigBuilder {
    return this.setMaxHistorySize(maxSize).setAutoSaveInterval(autoSaveInterval).addCommand('undo');
  }

  /**
   * 启用内容操作命令
   */
  enableContentOperations(): EditorConfigBuilder {
    return this.addCommands(['reset', 'clear']);
  }

  /**
   * 启用列表功能
   */
  enableLists(): EditorConfigBuilder {
    return this.addCommands(['orderedList', 'unorderedList']);
  }

  /**
   * 构建配置对象
   */
  build(): RichTextEditorOptions {
    return { ...this.config };
  }

  /**
   * 从预设配置开始构建
   */
  static fromPreset(preset: keyof typeof EditorPresets): EditorConfigBuilder {
    const builder = new EditorConfigBuilder();
    const presetConfig = EditorPresets[preset]();
    Object.assign(builder.config, presetConfig);
    return builder;
  }
}

/**
 * 快速创建配置的辅助函数
 */
export const createEditorConfig = {
  /**
   * 基础编辑器配置
   */
  basic: (editorId?: string) => (EditorPresets.basic().editorId = editorId || 'editor'),

  /**
   * 标准编辑器配置
   */
  standard: (
    editorId?: string,
    options?: { maxHistorySize?: number; autoSaveInterval?: number }
  ) => ({
    ...EditorPresets.standard(),
    editorId: editorId || 'editor',
    ...options,
  }),

  /**
   * 自定义配置
   */
  custom: () => new EditorConfigBuilder(),
};

/**
 * 验证配置的有效性
 */
export function validateEditorConfig(config: RichTextEditorOptions): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查历史记录配置
  if (config.maxHistorySize !== undefined) {
    if (config.maxHistorySize < 1) {
      errors.push('maxHistorySize must be at least 1');
    } else if (config.maxHistorySize > 1000) {
      warnings.push('maxHistorySize is very large, may cause memory issues');
    }
  }

  // 检查自动保存间隔
  if (config.autoSaveInterval !== undefined) {
    if (config.autoSaveInterval < 100) {
      warnings.push('autoSaveInterval is very short, may cause performance issues');
    } else if (config.autoSaveInterval > 10000) {
      warnings.push('autoSaveInterval is very long, may lose changes');
    }
  }

  // 检查命令配置
  if (config.supportedCommands) {
    const hasUndo = config.supportedCommands.includes('undo');

    if (hasUndo && config.maxHistorySize === 0) {
      errors.push('Undo command is enabled but maxHistorySize is 0');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 使用示例：
 *
 * // 使用预设配置
 * const config1 = EditorPresets.standard();
 *
 * // 使用构建器
 * const config2 = new EditorConfigBuilder()
 *   .setEditorId('my-editor')
 *   .enableFormatting()
 *   .enableHistory(50, 500)
 *   .enableContentOperations()
 *   .build();
 *
 * // 从预设开始自定义
 * const config3 = EditorConfigBuilder
 *   .fromPreset('standard')
 *   .setMaxHistorySize(100)
 *   .addCommand('customCommand')
 *   .build();
 *
 * // 验证配置
 * const validation = validateEditorConfig(config2);
 * if (!validation.isValid) {
 *   console.error('Config errors:', validation.errors);
 * }
 */
