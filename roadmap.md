核心功能待办 (To-Do)：上下文感知聊天 (高优)、设置面板、账户同步、自定义主题。
体验优化 (Optimization)：快捷键支持、虚拟滚动、AI 能力增强 (联网搜索)。
商业化可能性 (Monetization)：Freemium 模式、支付集成。
架构债务 (Tech Debt)：测试覆盖、错误监控、CI/CD。

## 实施计划：上下文感知聊天 (Context-Aware Chat)
目标：实现“与网页对话”功能，允许用户在浏览其他标签页时使用侧边栏与 AI 交流当前页面内容。

### 1. 配置更新 (Configuration)
- [ ] 修改 `wxt.config.ts`，添加必要权限：`activeTab`, `scripting`, `sidePanel`。
- [ ] 配置 `action` 以支持侧边栏触发。

### 2. 新增入口 (Entrypoints)
- [ ] 创建 `entrypoints/sidepanel/` 目录 (index.html, main.tsx)。
- [ ] 复用 `ChatWindow` 组件，确保聊天体验一致。
- [ ] 共享聊天记录 (基于 `chrome.storage.local`)。

### 3. 组件功能 (Components)
- [ ] **ChatWindow.tsx**:
    - 新增“添加页面上下文”按钮 (仅在有可用上下文时显示)。
    - 实现 `chrome.scripting.executeScript` 提取当前页面文本。
    - 将页面内容作为系统消息或隐藏前缀发送给 AI。