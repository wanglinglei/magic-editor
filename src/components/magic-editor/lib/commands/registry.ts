import type { CommandType } from '../../types/command';
import type { ICommandExecutor } from './base';
import { FormatCommandExecutor, FORMAT_COMMANDS } from './format';
import {
  ResetCommandExecutor,
  UndoCommandExecutor,
  RedoCommandExecutor,
  ClearCommandExecutor,
  CONTENT_COMMANDS,
} from './content';
import { OrderedListCommandExecutor, UnorderedListCommandExecutor, LIST_COMMANDS } from './list';

/**
 * 命令注册中心
 * 负责管理所有命令执行器的注册和获取
 */
export class CommandRegistry {
  private readonly executors = new Map<CommandType, ICommandExecutor>();

  constructor(private readonly editor: HTMLElement) {
    this.registerDefaultCommands();
  }

  /**
   * 注册默认命令
   */
  private registerDefaultCommands(): void {
    // 注册格式化命令
    const formatExecutor = new FormatCommandExecutor(this.editor);
    FORMAT_COMMANDS.forEach((command) => {
      this.executors.set(command as CommandType, formatExecutor);
    });

    // 注册内容操作命令
    this.executors.set('reset', new ResetCommandExecutor(this.editor));
    this.executors.set('undo', new UndoCommandExecutor(this.editor));
    this.executors.set('redo', new RedoCommandExecutor(this.editor));

    // 注册列表命令（如果需要）
    // this.executors.set('orderedList', new OrderedListCommandExecutor(this.editor));
    // this.executors.set('unorderedList', new UnorderedListCommandExecutor(this.editor));
  }

  /**
   * 注册新的命令执行器
   */
  register(command: CommandType, executor: ICommandExecutor): void {
    this.executors.set(command, executor);
  }

  /**
   * 获取命令执行器
   */
  get(command: CommandType): ICommandExecutor | undefined {
    return this.executors.get(command);
  }

  /**
   * 检查命令是否已注册
   */
  has(command: CommandType): boolean {
    return this.executors.has(command);
  }

  /**
   * 获取所有已注册的命令
   */
  getAllCommands(): CommandType[] {
    return Array.from(this.executors.keys());
  }

  /**
   * 移除命令执行器
   */
  unregister(command: CommandType): boolean {
    return this.executors.delete(command);
  }

  /**
   * 清空所有命令执行器
   */
  clear(): void {
    this.executors.clear();
  }

  /**
   * 获取命令执行器数量
   */
  size(): number {
    return this.executors.size;
  }
}

/**
 * 获取所有支持的命令类型
 */
export function getAllSupportedCommands(): readonly string[] {
  return [...FORMAT_COMMANDS, ...CONTENT_COMMANDS, ...LIST_COMMANDS];
}
