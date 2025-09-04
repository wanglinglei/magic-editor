/**
 * 格式化命令类型
 */
export type FormatCommandType = 'blod' | 'italic' | 'underline' | 'strikeThrough';

/**
 * 内容操作命令类型
 */
export type ContentCommandType = 'reset' | 'undo' | 'redo' | 'clear';

/**
 * 列表命令类型
 */
export type ListCommandType = 'orderedList' | 'unorderedList';

/**
 * 链接命令类型
 */
export type LinkCommandType = 'createLink' | 'removeLink';

/**
 * 图片命令类型
 */
export type ImageCommandType = 'insertImage' | 'removeImage';

/**
 * 表格命令类型
 */
export type TableCommandType =
  | 'insertTable'
  | 'deleteTable'
  | 'insertRow'
  | 'deleteRow'
  | 'insertColumn'
  | 'deleteColumn';

/**
 * 支持的所有命令类型
 */
export type CommandType =
  | FormatCommandType
  | ContentCommandType
  | ListCommandType
  | LinkCommandType
  | ImageCommandType
  | TableCommandType;

/**
 * 命令数据接口
 */
export interface CommandData {
  command: CommandType;
  range: Range;
  selection: Selection;
}

/**
 * 格式化配置接口
 */
export interface FormatConfig {
  tagName: string;
  styleProperty: string;
  styleValue: string;
}

/**
 * 命令执行结果
 */
export interface CommandResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * 命令执行器接口
 */
export interface CommandExecutor {
  execute(commandData: CommandData, editor: HTMLElement): CommandResult;
}

/**
 * 编辑器事件类型
 */
export type EditorEventType =
  | 'input'
  | 'keyup'
  | 'keydown'
  | 'mouseup'
  | 'mousedown'
  | 'focus'
  | 'blur';

/**
 * 编辑器事件处理器
 */
export type EditorEventHandler = (event: Event) => void;
