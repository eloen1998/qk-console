## [0.3.2](https://github.com/eloen1998/qk-console/compare/v0.3.0...v0.3.2) (2023-07-14)


### Bug Fixes

* 在选中变量生成打印语句时进行trim ([3325947](https://github.com/eloen1998/qk-console/commit/3325947ba5e3cd01f147296d5258bd318a5c8578))


### Features

* 增加for in, for of, switch case的识别 ([22f99d9](https://github.com/eloen1998/qk-console/commit/22f99d967593fb38bc2c6d0c4de64bfc7e84c066))
* 增加if、import变量识别 ([7de094e](https://github.com/eloen1998/qk-console/commit/7de094ee37455b647eee31d165fde478ed95d589))
* 增加time代码片段 ([58233d4](https://github.com/eloen1998/qk-console/commit/58233d4200cd9e3d396b8f58690cb9166c73fd16))



# [0.3.0](https://github.com/eloen1998/qk-console/compare/v0.2.5...v0.3.0) (2023-05-30)


### Bug Fixes

* 识别不出深层console语句问题 ([3d89468](https://github.com/eloen1998/qk-console/commit/3d894682928fae9454af847207420f91eb6d7504))


### Features

* 优化test中读文件方式，图标引入修改 ([a1d56f9](https://github.com/eloen1998/qk-console/commit/a1d56f94370efc88273894fa42de95fbbf15b7a9))


### Performance Improvements

* 引入webpack进行打包，减小包体积 ([eeff214](https://github.com/eloen1998/qk-console/commit/eeff214573ecc1355af09dd96529c80477611bcf))



## [0.2.5](https://github.com/eloen1998/qk-console/compare/v0.2.0...v0.2.5) (2023-04-18)


### Features

* 降级兼容1.70 ([fbc7b0c](https://github.com/eloen1998/qk-console/commit/fbc7b0c7ed4c81854c4cd24d542eeb01771b955b))
* 删除console支持vue文件 ([d2bf29c](https://github.com/eloen1998/qk-console/commit/d2bf29c1ffcd3496f8d2b294328252a82750d85d))
* 增加对对象中字符串表达式函数名称的识别 ([c9ea85d](https://github.com/eloen1998/qk-console/commit/c9ea85d6595f7056c5fb69943acd8b085bce84c5))
* 增加箭头函数识别 ([ca01742](https://github.com/eloen1998/qk-console/commit/ca01742ff7799c9c325c0b356afeacb8f77b3ef1))
* 增加配置项 ([60bf6a6](https://github.com/eloen1998/qk-console/commit/60bf6a6f680147dc6c6537299605dff117e1a556))
* 增加删除console范围，增加删除操作提示 ([b1e8612](https://github.com/eloen1998/qk-console/commit/b1e8612ba35aeb7a725f161e00666d09a8ff8aba))
* 增加语法错误提示 ([1c4f8ab](https://github.com/eloen1998/qk-console/commit/1c4f8ab3df7ad5ead8d819375248e2c07f114b64))



# [0.2.0](https://github.com/eloen1998/qk-console/compare/v0.1.0...v0.2.0) (2023-03-30)


### Features

* 增加删除console指令 ([8eaf968](https://github.com/eloen1998/qk-console/commit/8eaf968689a61479435ceeac842e27471525dd68))



# [0.1.0](https://github.com/eloen1998/qk-console/compare/f852e76d612801a2d3d664fa454bd8790eafbe30...v0.1.0) (2023-03-16)


### Bug Fixes

* 插入代码时需要选择代码片段问题 ([b3fa842](https://github.com/eloen1998/qk-console/commit/b3fa842aa61124eb79a5350a43bf6d79c53495a4))
* 修复函数中声明变量后多打印函数名称问题 ([f852e76](https://github.com/eloen1998/qk-console/commit/f852e76d612801a2d3d664fa454bd8790eafbe30))


### Features

* 优化当前行为空行的行为 ([063ab43](https://github.com/eloen1998/qk-console/commit/063ab437205ddff979efdc10cb104b58042bea27))
* 增加各种解构赋值的变量识别 ([410f32f](https://github.com/eloen1998/qk-console/commit/410f32f1165e78983654db60cb4dafcc3881bc22))
