import { BaseCommandExecutor } from './base';
import type { HistoryManager } from '../history';
import { DEFAULT_EDITOR_CONTENT } from '../../constants/editor';

/**
 * 重置命令执行器
 * 处理编辑器内容重置功能
 */
export class ResetCommandExecutor extends BaseCommandExecutor {
  constructor(
    private readonly editor: HTMLElement,
    private readonly historyManager?: HistoryManager
  ) {
    super();
  }

  protected executeCommand(): void {
    this.resetContent();
  }

  /**
   * 重置内容
   */
  private resetContent(): void {
    const newContent = `<p>${DEFAULT_EDITOR_CONTENT}</p>`;
    this.editor.innerHTML = newContent;

    // 保存到历史记录
    if (this.historyManager) {
      this.historyManager.forceSave(newContent);
    }
  }
}

/**
 * 撤销命令执行器
 * 处理撤销操作
 */
export class UndoCommandExecutor extends BaseCommandExecutor {
  constructor(
    private readonly editor: HTMLElement,
    private readonly historyManager?: HistoryManager
  ) {
    super();
  }

  protected executeCommand(): void {
    if (!this.historyManager) {
      console.warn('History manager is not available for undo operation');
      return;
    }

    // 检查是否可以撤销
    if (!this.historyManager.canUndo()) {
      console.warn('No more actions to undo');
      return;
    }

    const record = this.historyManager.undo();
    if (!record) {
      console.warn('Failed to get undo record');
      return;
    }

    // 恢复内容
    this.editor.innerHTML = record.content;

    // 如果有选择状态，尝试恢复（可选功能）
    if (record.selection) {
      this.restoreSelectionState(record.selection);
    }

    console.log('Undo operation completed successfully');
  }

  /**
   * 恢复选择状态（简单实现）
   */
  private restoreSelectionState(selection: { start: number; end: number }): void {
    try {
      const textContent = this.editor.textContent || '';
      if (selection.start <= textContent.length && selection.end <= textContent.length) {
        const range = document.createRange();
        const sel = window.getSelection();

        if (sel) {
          // 这里是简化实现，实际项目中可能需要更复杂的选择恢复逻辑
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } catch (error) {
      // 选择恢复失败不影响撤销操作
      console.warn('Failed to restore selection:', error);
    }
  }
}

/**
 * 清空命令执行器
 * 清空编辑器所有内容
 */
export class ClearCommandExecutor extends BaseCommandExecutor {
  constructor(
    private readonly editor: HTMLElement,
    private readonly historyManager?: HistoryManager
  ) {
    super();
  }

  protected executeCommand(): void {
    const newContent = '';
    this.editor.innerHTML = newContent;

    // 保存到历史记录
    if (this.historyManager) {
      this.historyManager.forceSave(newContent);
    }
  }
}

// 导出常量，从统一的常量文件中重新导出
export {
  DEFAULT_CONTENT_COMMANDS_CONFIG,
  CONTENT_COMMANDS,
  isContentCommand,
} from '../../constants/commands';
