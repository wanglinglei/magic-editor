# 命令系统架构

## 📁 文件结构

```
commands/
├── base.ts          # 基础接口和抽象类
├── format.ts        # 格式化命令（粗体、斜体等）
├── content.ts       # 内容操作命令（重置、撤销等）
├── list.ts          # 列表命令（有序、无序列表）
├── registry.ts      # 命令注册中心
├── examples.ts      # 扩展示例（链接、图片等）
├── index.ts         # 模块导出
└── README.md        # 本文档
```

## 🏗️ 架构设计

### 1. 基础架构

- **ICommandExecutor**: 命令执行器接口
- **BaseCommandExecutor**: 抽象基类，提供通用功能
- **CommandRegistry**: 命令注册中心，管理所有命令

### 2. 命令分类

| 类别     | 文件          | 命令类型             | 说明                                   |
| -------- | ------------- | -------------------- | -------------------------------------- |
| 格式化   | `format.ts`   | `FormatCommandType`  | 文本格式化：粗体、斜体、下划线、删除线 |
| 内容操作 | `content.ts`  | `ContentCommandType` | 内容管理：重置、撤销、重做、清空       |
| 列表     | `list.ts`     | `ListCommandType`    | 列表功能：有序列表、无序列表           |
| 链接     | `examples.ts` | `LinkCommandType`    | 链接管理：创建链接、移除链接           |
| 图片     | `examples.ts` | `ImageCommandType`   | 图片管理：插入图片、移除图片           |
| 表格     | 待实现        | `TableCommandType`   | 表格功能：插入表格、删除表格等         |

## 🚀 如何添加新命令

### 步骤 1: 定义命令类型

在 `types/command.ts` 中添加新的命令类型：

```typescript
export type MyCommandType = 'myCommand1' | 'myCommand2';

// 更新总的命令类型
export type CommandType =
  | FormatCommandType
  | ContentCommandType
  | MyCommandType; // 添加新类型
```

### 步骤 2: 创建命令执行器

创建新的命令文件，例如 `my-commands.ts`：

```typescript
import type { CommandData } from '../../types/command';
import { BaseCommandExecutor } from './base';

export class MyCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(commandData: CommandData): void {
    const { command } = commandData;

    switch (command) {
      case 'myCommand1':
        this.handleCommand1(commandData);
        break;
      case 'myCommand2':
        this.handleCommand2(commandData);
        break;
      default:
        throw new Error(`Unsupported command: ${command}`);
    }
  }

  private handleCommand1(commandData: CommandData): void {
    // 实现命令逻辑
  }

  private handleCommand2(commandData: CommandData): void {
    // 实现命令逻辑
  }
}

export const MY_COMMANDS = ['myCommand1', 'myCommand2'] as const;
```

### 步骤 3: 注册命令

在 `registry.ts` 中注册新命令：

```typescript
private registerDefaultCommands(): void {
  // ... 现有代码 ...

  // 注册新命令
  const myExecutor = new MyCommandExecutor(this.editor);
  MY_COMMANDS.forEach((command) => {
    this.executors.set(command as CommandType, myExecutor);
  });
}
```

### 步骤 4: 导出模块

在 `index.ts` 中导出新模块：

```typescript
export { MyCommandExecutor, MY_COMMANDS } from './my-commands';
```

### 步骤 5: 添加UI按钮

在HTML中添加对应的按钮：

```html
<button class="commond-button" data-command="myCommand1">我的命令1</button>
<button class="commond-button" data-command="myCommand2">我的命令2</button>
```

## 🔧 高级用法

### 动态注册命令

```typescript
// 创建自定义命令执行器
class CustomExecutor extends BaseCommandExecutor {
  protected executeCommand(commandData: CommandData): void {
    console.log('执行自定义命令');
  }
}

// 动态注册
const customExecutor = new CustomExecutor();
command.registerCommand('customCommand', customExecutor);
```

### 命令验证

```typescript
// 检查命令是否已注册
if (command.hasCommand('myCommand')) {
  // 执行命令
}

// 获取所有支持的命令
const supportedCommands = command.getSupportedCommands();
```

### 命令移除

```typescript
// 移除特定命令
command.unregisterCommand('myCommand');

// 获取注册中心进行高级操作
const registry = command.getRegistry();
registry.clear(); // 清空所有命令
```

## 🎯 最佳实践

1. **单一职责**: 每个命令执行器只处理相关的命令类型
2. **错误处理**: 继承 `BaseCommandExecutor` 获得统一的错误处理
3. **类型安全**: 使用 TypeScript 类型确保命令类型安全
4. **模块化**: 按功能分类组织命令文件
5. **可扩展**: 通过注册机制支持动态添加命令

## 📝 注意事项

- 所有命令执行器都应该继承 `BaseCommandExecutor`
- 命令类型必须在 `types/command.ts` 中定义
- 新命令需要在 `CommandRegistry` 中注册
- HTML 按钮需要添加 `data-command` 属性
- 建议为每个命令类别创建独立的文件
