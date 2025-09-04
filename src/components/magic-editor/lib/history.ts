/**
 * 历史记录项接口
 */
export interface HistoryRecord {
  /** 内容HTML */
  content: string;
  /** 时间戳 */
  timestamp: number;
  /** 选择状态（可选） */
  selection?: {
    start: number;
    end: number;
  };
}

/**
 * 历史记录配置接口
 */
export interface HistoryConfig {
  /** 最大历史记录数量，默认30 */
  maxSize?: number;
  /** 是否启用历史记录，默认根据命令自动检测 */
  enabled?: boolean;
  /** 自动保存间隔（毫秒），默认1000ms */
  autoSaveInterval?: number;
  /** 支持的命令列表，用于自动检测是否需要启用历史记录 */
  supportedCommands?: string[];
}

/**
 * 历史记录管理器
 * 负责管理编辑器的历史记录，支持撤销和重做操作
 */
export class HistoryManager {
  private readonly history: HistoryRecord[] = [];
  private currentIndex: number = -1;
  private readonly maxSize: number;
  private readonly enabled: boolean;
  private readonly autoSaveInterval: number;
  private lastSaveTime: number = 0;
  private isUndoRedoOperation: boolean = false;

  constructor(config: HistoryConfig = {}) {
    const { maxSize = 30, enabled, autoSaveInterval = 1000, supportedCommands = [] } = config;

    this.maxSize = maxSize;
    this.autoSaveInterval = autoSaveInterval;

    // 如果没有明确指定enabled，则根据支持的命令自动检测
    if (enabled !== undefined) {
      this.enabled = enabled;
    } else {
      this.enabled = this.shouldEnableHistory(supportedCommands);
    }
  }

  /**
   * 根据支持的命令判断是否应该启用历史记录
   */
  private shouldEnableHistory(supportedCommands: string[]): boolean {
    // 如果支持的命令中包含任何历史记录相关命令，则启用历史记录
    return supportedCommands.includes('undo');
  }

  /**
   * 保存历史记录
   */
  save(content: string, selection?: { start: number; end: number }): void {
    if (!this.enabled) {
      return;
    }

    // 如果是撤销/重做操作，不保存历史记录
    if (this.isUndoRedoOperation) {
      return;
    }

    const now = Date.now();

    // 检查是否需要自动保存（防止频繁保存）
    if (now - this.lastSaveTime < this.autoSaveInterval) {
      return;
    }

    // 检查内容是否有变化
    const lastRecord = this.getCurrentRecord();
    if (lastRecord && lastRecord.content === content) {
      return;
    }

    const record: HistoryRecord = {
      content,
      timestamp: now,
      selection,
    };

    // 如果当前不在历史记录的末尾，删除当前位置之后的所有记录
    if (this.currentIndex < this.history.length - 1) {
      this.history.splice(this.currentIndex + 1);
    }

    // 添加新记录
    this.history.push(record);
    this.currentIndex = this.history.length - 1;

    // 如果超过最大数量，删除最早的记录
    if (this.history.length > this.maxSize) {
      this.history.shift();
      this.currentIndex--;
    }

    this.lastSaveTime = now;
  }

  /**
   * 撤销操作
   */
  undo(): HistoryRecord | null {
    if (!this.enabled || !this.canUndo()) {
      return null;
    }

    this.isUndoRedoOperation = true;
    this.currentIndex--;
    const record = this.getCurrentRecord();

    // 重置标志，允许在下次内容变化时保存
    setTimeout(() => {
      this.isUndoRedoOperation = false;
    }, 100);

    return record;
  }

  /**
   * 检查是否可以撤销
   */
  canUndo(): boolean {
    console.log('canUndo', this.enabled, this.currentIndex);
    console.log('history', this.history);
    return this.enabled && this.currentIndex > 0;
  }

  /**
   * 获取当前历史记录
   */
  getCurrentRecord(): HistoryRecord | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * 获取历史记录数量
   */
  getHistorySize(): number {
    return this.history.length;
  }

  /**
   * 获取当前索引
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 清空历史记录
   */
  clear(): void {
    this.history.length = 0;
    this.currentIndex = -1;
    this.lastSaveTime = 0;
  }

  /**
   * 初始化历史记录（保存初始状态）
   */
  initialize(content: string): void {
    if (!this.enabled) {
      return;
    }

    this.clear();
    this.save(content);
  }

  /**
   * 获取历史记录状态信息
   */
  getStatus(): {
    canUndo: boolean;
    currentIndex: number;
    totalRecords: number;
    enabled: boolean;
  } {
    return {
      canUndo: this.canUndo(),
      currentIndex: this.currentIndex,
      totalRecords: this.history.length,
      enabled: this.enabled,
    };
  }

  /**
   * 强制保存当前状态（忽略时间间隔限制）
   */
  forceSave(content: string, selection?: { start: number; end: number }): void {
    if (!this.enabled) {
      return;
    }

    const originalInterval = this.lastSaveTime;
    this.lastSaveTime = 0; // 重置时间，强制保存
    this.save(content, selection);

    // 如果没有保存成功，恢复原来的时间
    if (this.lastSaveTime === 0) {
      this.lastSaveTime = originalInterval;
    }
  }

  /**
   * 设置是否启用历史记录
   */
  setEnabled(enabled: boolean): void {
    // 由于enabled是readonly，这里需要特殊处理
    Object.defineProperty(this, 'enabled', {
      value: enabled,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    if (!enabled) {
      this.clear();
    }
  }

  /**
   * 获取所有历史记录（用于调试）
   */
  getAllRecords(): readonly HistoryRecord[] {
    return Object.freeze([...this.history]);
  }
}
