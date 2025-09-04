/**
 * 编辑器操作类型
 * undo: 撤销
 * reset: 重置
 * blod: 加粗
 * italic: 斜体
 * underline: 下划线
 * strikeThrough: 删除线
 */
export type EditorToolType = 'undo' | 'reset' | 'blod' | 'italic' | 'underline' | 'strikeThrough';

/**
 * 编辑器操作类型
 * default: 默认
 * group: 组
 */
export type EditorOperatorType = 'default' | 'group';

// export interface EditorOperator {
//   type: EditorToolType;
//   operatorType: EditorOperatorType;
//   label?: string;
//   icon?: string;
//   children?: EditorOperator[];
// }

/**
 * 编辑器属性
 */
export interface EditorProps {
  /** 样式 */
  style?: Record<string, string | number>;
  /** 编辑器ID */
  editorId?: string;
  /** 操作按钮组 - 支持字符串数组或对象数组 */
  operators?: string[][];
  /** 默认内容 */
  defaultContent?: string;
  /** 历史记录最大数量，默认30 */
  maxHistorySize?: number;
  /** 自动保存间隔（毫秒），默认1000ms */
  autoSaveInterval?: number;
}
