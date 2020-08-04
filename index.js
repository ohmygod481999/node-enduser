const express = require("express");
const { Liquid } = require("liquidjs");
const eInstance = require("./utils/es");
const Configuration = require("./utils/config");
const utils = require("./utils/utils");

const engine = new Liquid();

const app = express();
const port = 3001;

app.engine('liquid', engine.express()); 
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set liquid to default
 
app.get("/*", async (req, res) => {
    const [pageId, pageParamId] = req.params['0'].split("/");

    const pageInfo = await utils.getPageInfo(eInstance, "labo");
    const sections = await eInstance.getPageSections(pageId);

    const articles = await eInstance.getArticlesByCategory();

    const renderedSection = await engine.parseAndRender(sections[0], {
        articles: articles.map((article) => ({
            ...article,
            image: Configuration.imageRoot + article.images[0].path,
        })),
    });
    sections[0] = renderedSection;
    // res.send(sections.join("\n"));
    
    res.render("index", {
        styles: pageInfo.styles,
        scripts: pageInfo.scripts,
        sections: sections.join("")
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
