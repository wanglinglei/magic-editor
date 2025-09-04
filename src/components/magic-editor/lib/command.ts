import type { CommandData } from '../types/command';
import { PROPERTY, DEFAULT_EDITOR_CONTENT } from '../constants';
export class Command {
  constructor(private editor: HTMLElement) {}

  executeCommand(commandData: CommandData) {
    const { command, range, selection } = commandData;
    if (!range || !selection) {
      return;
    }
    switch (command) {
      case 'blod':
      case 'italic':
      case 'underline':
      case 'strikeThrough':
        this.toggleFormat(commandData);
        break;
      case 'reset':
        this.resetContent();
    }
  }

  /**
   * @description: 重置内容
   * @return {*}
   */
  resetContent() {
    this.editor.innerHTML = `<p>${DEFAULT_EDITOR_CONTENT}</p>`;
  }

  // 切换格式化（粗体、斜体等）
  toggleFormat(commandData: CommandData) {
    const { command, range, selection } = commandData;

    const selectedText = range.toString();
    if (!selectedText) {
      return;
    }

    // 检查是否已经应用了格式
    const parentElement =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : (range.commonAncestorContainer as HTMLElement);
    const commandProperty = PROPERTY[command as keyof typeof PROPERTY];
    if (!commandProperty) {
      return;
    }
    const { tagName, styleProperty, styleValue } = commandProperty;
    const isFormatted = parentElement
      ? this.isFormatApplied(parentElement, tagName, styleProperty, styleValue)
      : false;

    if (isFormatted) {
      this.removeFormat(commandData, tagName);
    } else {
      this.applyFormatToRange(commandData, tagName, styleProperty, styleValue);
    }

    // 恢复选择
    selection.removeAllRanges();
    selection.addRange(range.cloneRange());
  }

  // 应用格式到范围
  applyFormatToRange(
    commandData: CommandData,
    tagName: string,
    styleProperty: string,
    styleValue: string
  ) {
    const { range } = commandData;
    // const range = this.getRange()
    // const selection = this.getSelection()
    const element = document.createElement(tagName);
    if (styleProperty && styleValue) {
      element.style.setProperty(styleProperty, styleValue);
    }
    try {
      range.surroundContents(element);
    } catch (e) {
      // 如果不能直接包围内容，则提取内容
      const contents = range.extractContents();
      element.appendChild(contents);
      range.insertNode(element);
    }
  }

  // 移除格式
  removeFormat(commandData: CommandData, tagName: string) {
    const { range, selection } = commandData;
    // const selection = this.getSelection()
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
    selection.removeAllRanges();
    selection.addRange(range.cloneRange());
  }

  // 检查格式是否已应用
  isFormatApplied(
    element: HTMLElement,
    tagName: string,
    styleProperty: string,
    styleValue: string
  ) {
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
