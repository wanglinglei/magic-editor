import type { CommandData } from '../../types/command';
import { BaseCommandExecutor } from './base';

/**
 * 有序列表命令执行器
 */
export class OrderedListCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    this.toggleList(commandData, 'ol');
  }

  private toggleList(commandData: CommandData, listType: 'ol' | 'ul'): void {
    const { range, selection } = commandData;

    // TODO: 实现列表切换逻辑
    console.log(`Toggle ${listType} list - to be implemented`);

    // 恢复选择
    this.restoreSelection(selection, range);
  }
}

/**
 * 无序列表命令执行器
 */
export class UnorderedListCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    this.toggleList(commandData, 'ul');
  }

  private toggleList(commandData: CommandData, listType: 'ol' | 'ul'): void {
    const { range, selection } = commandData;

    // TODO: 实现列表切换逻辑
    console.log(`Toggle ${listType} list - to be implemented`);

    // 恢复选择
    this.restoreSelection(selection, range);
  }
}

/**
 * 支持的列表命令列表
 */
export const LIST_COMMANDS = ['orderedList', 'unorderedList'] as const;

/**
 * 检查是否为列表命令
 */
export function isListCommand(command: string): command is (typeof LIST_COMMANDS)[number] {
  return LIST_COMMANDS.includes(command as (typeof LIST_COMMANDS)[number]);
}
