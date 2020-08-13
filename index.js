const express = require("express");
const eInstance = require("./data/es");
const Configuration = require("./utils/config");
// const utils = require("./utils/utils");
const { gClient, getQueryMulti, queryGraph } = require("./data/graph");
const { Liquid } = require("liquidjs");
const { default: gql } = require("graphql-tag");
const { getPageInfo, renderLiquid } = require("./data");
const engine = new Liquid();

const app = express();
const port = 3003;

app.engine("liquid", engine.express());
app.set("views", "./views"); // specify the views directory
app.set("view engine", "liquid"); // set liquid to default

app.get("/*", async (req, res) => {
    let [pageId, pageParamId] = req.params["0"].split("/");

    // phai lay trang home neu ko co first params
    if (!pageId) pageId = Configuration.pages.home

    const pageInfo = await getPageInfo(eInstance, "labo");

    const sections = await eInstance.getPageSections(pageId);

    let renderLiquidSections = []
    for (let section of sections) {
        const temp = await renderLiquid(engine, section, pageParamId);
        renderLiquidSections.push(temp)
    }

    res.render("index", {
        styles: pageInfo.styles,
        scripts: pageInfo.scripts,
        sections: renderLiquidSections.join(""),
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
