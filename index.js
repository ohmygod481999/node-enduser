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
    const [pageId, pageParamId] = req.params["0"].split("/");

    const pageInfo = await getPageInfo(eInstance, "labo");

    const sections = await eInstance.getPageSections(Configuration.pages.home);

    // const temp = await queryGraph("single", "article", {
    //     id: "0e694889-b854-a337-dc9e-5e3d547ac2e1"
    // }, ["id", "name"])
    // console.log(temp)

    let renderLiquidSections = []
    for (let section of sections) {
        const temp = await renderLiquid(engine, section);
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
