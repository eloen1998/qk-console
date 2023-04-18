# QK-Console

#### 一款vscode插件，帮助你快速地console.log出想要的变量。



##### 功能点
1. 直接插入打印语句模板
2. 选中变量，按照模板插入打印语句
3. **自动**识别当前行的*变量*，插入该变量的打印语句
4. 一键删除console
5. 插入格式配置

![使用示例](https://raw.githubusercontent.com/eloen1998/qk-console/main/static/screenshots.gif)



##### 插入console使用方式
1. 命令 qkConsole.insertConsole
2. 快捷键 cmd+y（MAC，window可自行配置）

##### 删除console使用方式
1. 命令 qkConsole.deleteConsole
2. 快捷键 cmd+u（MAC，window可自行配置）

##### 适用场景
1. js/ts/vue文件中
2. js、ts语句中，且不能有影响ast的语法错误
3. 当前行或上一行有变量，或者选中了想要输出变量



##### TDDO
 - [x] 利用 skip，stop进行性能优化
 - [x] 增加箭头函数识别
 - [x] consoleFormatter利用vscode.SnippetString重写
 - [x] console插入位置优化
