/**
 * 示例：如何添加新的命令类型
 *
 * 这个文件展示了如何扩展编辑器功能，添加新的命令类型
 * 包括链接、图片等高级功能的实现示例
 */

import type { CommandData } from '../../types/command';
import { BaseCommandExecutor } from './base';

/**
 * 链接命令执行器示例
 * 演示如何实现创建和移除链接功能
 */
export class LinkCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    const { command, range, selection } = commandData;

    switch (command) {
      case 'createLink':
        this.createLink(commandData);
        break;
      case 'removeLink':
        this.removeLink(commandData);
        break;
      default:
        throw new Error(`Unsupported link command: ${command}`);
    }

    // 恢复选择
    this.restoreSelection(selection, range);
  }

  private createLink(commandData: CommandData): void {
    const { range } = commandData;
    const selectedText = range.toString();

    if (!selectedText) {
      throw new Error('Please select text to create a link');
    }

    // 在实际应用中，这里应该弹出对话框让用户输入URL
    const url = prompt('Enter URL:');
    if (!url) {
      return;
    }

    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.textContent = selectedText;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';

    try {
      range.deleteContents();
      range.insertNode(linkElement);
    } catch {
      throw new Error('Failed to create link');
    }
  }

  private removeLink(commandData: CommandData): void {
    const { range } = commandData;

    // 查找选中区域内的链接元素
    let linkElement = range.commonAncestorContainer as HTMLElement;

    // 向上查找链接元素
    while (linkElement && linkElement !== this.editor) {
      if (linkElement.tagName === 'A') {
        break;
      }
      linkElement = linkElement.parentElement!;
    }

    if (!linkElement || linkElement.tagName !== 'A') {
      throw new Error('No link found in selection');
    }

    // 移除链接，保留文本
    const textNode = document.createTextNode(linkElement.textContent || '');
    linkElement.parentNode?.replaceChild(textNode, linkElement);
  }
}

/**
 * 图片命令执行器示例
 * 演示如何实现插入和移除图片功能
 */
export class ImageCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    const { command, range, selection } = commandData;

    switch (command) {
      case 'insertImage':
        this.insertImage(commandData);
        break;
      case 'removeImage':
        this.removeImage(commandData);
        break;
      default:
        throw new Error(`Unsupported image command: ${command}`);
    }

    // 恢复选择
    this.restoreSelection(selection, range);
  }

  private insertImage(commandData: CommandData): void {
    const { range } = commandData;

    // 在实际应用中，这里应该弹出文件选择对话框
    const imageUrl = prompt('Enter image URL:');
    if (!imageUrl) {
      return;
    }

    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.alt = 'Inserted image';
    imageElement.style.maxWidth = '100%';
    imageElement.style.height = 'auto';

    try {
      range.deleteContents();
      range.insertNode(imageElement);
    } catch {
      throw new Error('Failed to insert image');
    }
  }

  private removeImage(commandData: CommandData): void {
    const { range } = commandData;

    // 查找选中区域内的图片元素
    let imageElement = range.commonAncestorContainer as HTMLElement;

    // 向上查找图片元素
    while (imageElement && imageElement !== this.editor) {
      if (imageElement.tagName === 'IMG') {
        break;
      }
      imageElement = imageElement.parentElement!;
    }

    if (!imageElement || imageElement.tagName !== 'IMG') {
      throw new Error('No image found in selection');
    }

    // 移除图片
    imageElement.parentNode?.removeChild(imageElement);
  }
}

/**
 * 使用示例：
 *
 * // 1. 创建命令执行器实例
 * const linkExecutor = new LinkCommandExecutor(editor);
 * const imageExecutor = new ImageCommandExecutor(editor);
 *
 * // 2. 注册到命令系统
 * command.registerCommand('createLink', linkExecutor);
 * command.registerCommand('removeLink', linkExecutor);
 * command.registerCommand('insertImage', imageExecutor);
 * command.registerCommand('removeImage', imageExecutor);
 *
 * // 3. 在HTML中添加对应的按钮
 * <button class="commond-button" data-command="createLink">创建链接</button>
 * <button class="commond-button" data-command="removeLink">移除链接</button>
 * <button class="commond-button" data-command="insertImage">插入图片</button>
 * <button class="commond-button" data-command="removeImage">移除图片</button>
 */
