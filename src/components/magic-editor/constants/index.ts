// 编辑器相关常量
export * from './editor';

// 命令相关常量
export * from './commands';

// 保留原有的配置文件（为了向后兼容，后续可以逐步移除）
export * from './config';
// 注意：property.ts 中的 PROPERTY 已经在 commands.ts 中导出，避免重复导出
