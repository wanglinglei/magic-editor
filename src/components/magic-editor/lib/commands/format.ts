import type { CommandData, FormatConfig } from '../../types/command';
import { BaseCommandExecutor } from './base';
import { PROPERTY } from '../../constants/commands';

/**
 * 格式化命令执行器
 * 处理文本格式化相关的命令，如粗体、斜体、下划线等
 */
export class FormatCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    this.toggleFormat(commandData);
  }

  /**
   * 切换格式化（粗体、斜体等）
   */
  private toggleFormat(commandData: CommandData): void {
    const { command, range, selection } = commandData;

    const selectedText = range.toString();
    if (!selectedText) {
      return;
    }

    const formatConfig = this.getFormatConfig(command);
    if (!formatConfig) {
      throw new Error(`Unsupported format command: ${command}`);
    }

    const parentElement = this.getParentElement(range);
    const isFormatted = parentElement ? this.isFormatApplied(parentElement, formatConfig) : false;

    if (isFormatted) {
      this.removeFormat(commandData, formatConfig.tagName);
    } else {
      this.applyFormat(commandData, formatConfig);
    }

    // 恢复选择
    this.restoreSelection(selection, range);
  }

  /**
   * 获取格式配置
   */
  private getFormatConfig(command: string): FormatConfig | undefined {
    return PROPERTY[command as keyof typeof PROPERTY];
  }

  /**
   * 获取父元素
   */
  private getParentElement(range: Range): HTMLElement | null {
    return range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : (range.commonAncestorContainer as HTMLElement);
  }

  /**
   * 应用格式
   */
  private applyFormat(commandData: CommandData, formatConfig: FormatConfig): void {
    const { range } = commandData;
    const { tagName, styleProperty, styleValue } = formatConfig;

    const element = document.createElement(tagName);
    if (styleProperty && styleValue) {
      element.style.setProperty(styleProperty, styleValue);
    }

    try {
      range.surroundContents(element);
    } catch {
      // 如果不能直接包围内容，则提取内容
      const contents = range.extractContents();
      element.appendChild(contents);
      range.insertNode(element);
    }
  }

  /**
   * 移除格式
   */
  private removeFormat(commandData: CommandData, tagName: string): void {
    const { range, selection } = commandData;
    const selectedText = range.toString();

    // 创建一个临时容器来处理选中的内容
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectedText;

    // 移除指定的格式标签
    const elementsToRemove = tempDiv.querySelectorAll(tagName);
    elementsToRemove.forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    });

    // 替换选中的内容
    range.deleteContents();
    range.insertNode(document.createTextNode(tempDiv.textContent || ''));

    // 恢复选择
    this.restoreSelection(selection, range);
  }

  /**
   * 检查格式是否已应用
   */
  private isFormatApplied(element: HTMLElement, formatConfig: FormatConfig): boolean {
    const { tagName, styleProperty, styleValue } = formatConfig;
    let current = element;

    while (current && current !== this.editor) {
      if (current.tagName && current.tagName.toLowerCase() === tagName.toLowerCase()) {
        if (!styleProperty || current.style.getPropertyValue(styleProperty) === styleValue) {
          return true;
        }
      }
      current = current.parentElement!;
    }

    return false;
  }
}

// 导出常量，从统一的常量文件中重新导出
export {
  DEFAULT_FORMAT_COMMANDS_CONFIG,
  FORMAT_COMMANDS,
  isFormatCommand,
} from '../../constants/commands';
