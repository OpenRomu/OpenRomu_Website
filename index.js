const nunjucks = require('nunjucks')
const fs = require('fs')

const MASTER_SERVER = 'http://35.227.96.175:27337'
const MASTER_SERVER_HTTPS = 'https://35.227.96.175:443'

const outputPath = './dist'
const templatesPath = './templates'
const contentPath = './content'

async function main() {
    nunjucks.configure({ autoescape: true })
    const pages = ['index', 'howtoplay', 'archives', 'register' /* 'scores'*/]
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)
    // Iterate on all pages, render them and export as HTML in outputPath
    for (const page of pages) {
        const navigation = nunjucks.render(`${templatesPath}/navigation.html`, { page })
        let pageContent = null
        // Render page content (archive for examples load data from JSON)
        if (page === 'archives') {
            var archivesData = {
                versions: JSON.parse(fs.readFileSync(`${contentPath}/versions.json`, 'utf8')),
                maps: JSON.parse(fs.readFileSync(`${contentPath}/maps.json`, 'utf8'))
            }
            pageContent = nunjucks.render(`${templatesPath}/pages/${page}.html`, archivesData)
        } else {
            let contentData = {
                MASTER_SERVER,
                MASTER_SERVER_HTTPS
            }
            pageContent = nunjucks.render(`${templatesPath}/pages/${page}.html`, contentData)
        }
        const pageData = {
            MASTER_SERVER,
            MASTER_SERVER_HTTPS,
            navigation,
            pageContent
        }
        const pageHtml = nunjucks.render(`${templatesPath}/main.html`, pageData)
        fs.writeFileSync(`${outputPath}/${page}.html`, pageHtml)
    }
}
main()