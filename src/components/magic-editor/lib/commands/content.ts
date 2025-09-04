import type { CommandData } from '../../types/command';
import { DEFAULT_EDITOR_CONTENT } from '../../constants';
import { BaseCommandExecutor } from './base';

/**
 * 重置命令执行器
 * 处理编辑器内容重置功能
 */
export class ResetCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(): void {
    this.resetContent();
  }

  /**
   * 重置内容
   */
  private resetContent(): void {
    this.editor.innerHTML = `<p>${DEFAULT_EDITOR_CONTENT}</p>`;
  }
}

/**
 * 撤销命令执行器
 * 处理撤销操作（预留实现）
 */
export class UndoCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    // TODO: 实现撤销逻辑
    console.log('Undo command - to be implemented');
  }
}

/**
 * 重做命令执行器
 * 处理重做操作（预留实现）
 */
export class RedoCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    // TODO: 实现重做逻辑
    console.log('Redo command - to be implemented');
  }
}

/**
 * 清空命令执行器
 * 清空编辑器所有内容
 */
export class ClearCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(): void {
    this.editor.innerHTML = '';
  }
}

/**
 * 支持的内容操作命令列表
 */
export const CONTENT_COMMANDS = ['reset', 'undo', 'redo', 'clear'] as const;

/**
 * 检查是否为内容操作命令
 */
export function isContentCommand(command: string): command is (typeof CONTENT_COMMANDS)[number] {
  return CONTENT_COMMANDS.includes(command as (typeof CONTENT_COMMANDS)[number]);
}
