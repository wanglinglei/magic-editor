import type { CommandData, CommandResult } from '../../types/command';

/**
 * 命令执行器基础接口
 */
export interface ICommandExecutor {
  execute(commandData: CommandData, editor: HTMLElement): CommandResult;
}

/**
 * 抽象命令执行器基类
 * 提供通用的错误处理和日志记录功能
 */
export abstract class BaseCommandExecutor implements ICommandExecutor {
  /**
   * 执行命令的抽象方法，由子类实现具体逻辑
   */
  protected abstract executeCommand(commandData: CommandData, editor: HTMLElement): void;

  /**
   * 执行命令的公共入口，包含错误处理
   */
  execute(commandData: CommandData, editor: HTMLElement): CommandResult {
    try {
      this.validateCommandData(commandData);
      this.executeCommand(commandData, editor);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Command execution failed:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * 验证命令数据的有效性
   */
  protected validateCommandData(commandData: CommandData): void {
    const { range, selection } = commandData;
    if (!range || !selection) {
      throw new Error('Invalid command data: missing range or selection');
    }
  }

  /**
   * 恢复选择状态的通用方法
   */
  protected restoreSelection(selection: Selection, range: Range): void {
    selection.removeAllRanges();
    selection.addRange(range.cloneRange());
  }
}
