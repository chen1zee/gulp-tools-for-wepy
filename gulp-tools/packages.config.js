module.exports = {
    main: { // 主包page文件夹
        'home': true
    }
    // sub: [ // 分包page文件夹
    //
    // ]
    /**
     * subPackage 的根目录不能是另外一个 subPackage 内的子目录
     * 所以以现在的文件结构，只能以'pages/aaa/'为root 打包
     * */
    // 其余没配置的文件夹打成一个包
}
