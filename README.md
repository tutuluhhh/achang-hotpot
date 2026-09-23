# 马厂老火锅 - 多人在线点菜系统

## 本地运行

```bash
cd 马厂老火锅-在线版
npm install
npm start
```

然后访问 http://localhost:3000

## 一键部署到 Railway（推荐）

1. 访问 [Railway](https://railway.app/) 并用 GitHub 登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库（需要先推送代码到 GitHub）
4. 或者使用 "Deploy from Directory"：
   - 将 `马厂老火锅-在线版` 文件夹压缩成 zip
   - 在 Railway 选择 "Deploy from Directory"
5. 等待部署完成，会得到一个类似 `https://xxx.up.railway.app` 的链接
6. 分享这个链接给大家即可

## 部署到 Render（备选）

1. 访问 [Render](https://render.com/) 并注册
2. 点击 "New" → "Web Service"
3. 连接 GitHub 仓库或上传代码
4. 设置：
   - Build Command: `npm install`
   - Start Command: `npm start`
5. 点击 "Create Web Service"
6. 部署完成后获得在线链接

## 使用说明

1. 打开部署后的链接
2. URL 会自动生成房间号，如 `https://xxx.up.railway.app/#room_abc123`
3. 把这个链接发到群里
4. 每个人打开链接后选择自己的身份
5. 所有人同时点菜，实时同步
6. 查看汇总页面可以看到所有人的选择

## 特性

- ✅ 多人同时在线点菜
- ✅ 实时同步，无冲突
- ✅ 自动保存，刷新不丢失
- ✅ 房间隔离，不同链接互不影响
- ✅ 显示在线人数
- ✅ 支持调整最终菜单
- ✅ 一键导出最终菜单
