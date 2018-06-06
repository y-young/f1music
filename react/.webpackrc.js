const path = require('path')
export default {
    outputPath: path.resolve(__dirname, '../public/assets/'),
    extraBabelPlugins: [
        ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
    ]
}
