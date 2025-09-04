import type { CommandData, CommandResult, CommandType } from '../types/command';
import { CommandRegistry } from './commands';

/**
 * 命令管理器 - 使用命令注册中心管理不同类型的命令
 * 提供简化的接口，内部委托给CommandRegistry处理
 */
export class Command {
  private readonly registry: CommandRegistry;

  constructor(private readonly editor: HTMLElement) {
    this.registry = new CommandRegistry(editor);
  }

  /**
   * 执行命令
   */
  executeCommand(commandData: CommandData): CommandResult {
    const { command, range, selection } = commandData;

    if (!range || !selection) {
      const error = 'Invalid command data: missing range or selection';
      console.warn(error);
      return { success: false, error };
    }

    const executor = this.registry.get(command);
    if (!executor) {
      const error = `Unsupported command: ${command}`;
      console.warn(error);
      return { success: false, error };
    }

    return executor.execute(commandData, this.editor);
  }

  /**
   * 注册新的命令执行器
   */
  registerCommand(command: CommandType, executor: import('./commands').ICommandExecutor): void {
    this.registry.register(command, executor);
  }

  /**
   * 获取支持的命令列表
   */
  getSupportedCommands(): CommandType[] {
    return this.registry.getAllCommands();
  }

  /**
   * 检查命令是否已注册
   */
  hasCommand(command: CommandType): boolean {
    return this.registry.has(command);
  }

  /**
   * 移除命令执行器
   */
  unregisterCommand(command: CommandType): boolean {
    return this.registry.unregister(command);
  }

  /**
   * 获取命令注册中心实例（用于高级操作）
   */
  getRegistry(): CommandRegistry {
    return this.registry;
  }
}
