const nunjucks = require('nunjucks')
const fs = require('fs')

async function main() {
    nunjucks.configure({ autoescape: true })
    const outputPath = './dist'
    const templatesPath = './templates'
    const pages = ['home', 'scores', 'archives']
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)
    for (const page of pages) {
        const navigation = nunjucks.render(`${templatesPath}/navigation.html`, { page })
        const content = await fs.readFileSync(`${templatesPath}/pages/${page}.html`, 'utf8')
        const pageData = {
            navigation,
            content
        }
        const pageHtml = nunjucks.render(`${templatesPath}/index.html`, pageData)
        fs.writeFileSync(`${outputPath}/${page}.html`, pageHtml)
    }
}
main()