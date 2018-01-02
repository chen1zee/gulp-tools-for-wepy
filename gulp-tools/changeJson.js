const through = require('through2')
const config = require('./packages.config')

function changeJson () {
    return through.obj(function (file, enc, cb) {
        const str = file.contents.toString()
        const json = JSON.parse(str)
        // 有subPackages 字段 -> 不处理
        if (json.subPackages) return cb()
        const packagesJson = { // 处理后的 packages
            pages: [],
            subPackagesObj: {
            },
            subPackages: []
        }
        json.pages.forEach((page) => {
            // 例: 'pages/aaa/bbb' -> ['pages', 'aaa', 'bbb']
            const pageArr = page.split('/')
            const pageMsg = {
                path: page,
                dirName: pageArr[1],
                dirPath: `${pageArr[0]}/${pageArr[1]}/`,
                fileName: pageArr[2]
            }
            if (config.main[pageMsg.dirName]) { // 主包
                packagesJson.pages.push(pageMsg.path)
            } else { // 分包
                const dirPath = pageMsg.dirPath
                if (packagesJson.subPackagesObj[dirPath]) { // 已有
                    packagesJson.subPackagesObj[dirPath].push(pageMsg.fileName)
                } else {
                    packagesJson.subPackagesObj[dirPath] = [pageMsg.fileName]
                }
            }
        })
        Object.keys(packagesJson.subPackagesObj).forEach((root) => {
            packagesJson.subPackages.push({
                root,
                pages: packagesJson.subPackagesObj[root]
            })
        })
        json.pages = packagesJson.pages
        json.subPackages = packagesJson.subPackages
        file.contents = Buffer.from(JSON.stringify(json))
        doneConsole()
        this.push(file)
        cb()
    })
}

function doneConsole () {
    const date = new Date()
    const hour = date.getHours()
    const min = date.getMinutes()
    const sec = date.getSeconds()
    const twoShow = (val) => val < 10 ? `0${val}` : val
    console.log(`finish changeJson at ${twoShow(hour)}:${twoShow(min)}:${twoShow(sec)}`)
}

module.exports = changeJson
