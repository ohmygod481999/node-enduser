const Configuration = require("../utils/config");
const eInstance = require("./es");
const { queryGraph } = require("./graph");

exports.getSectionConfig = (section) => {
    let str = "";
    let liquid = "";
    let temp = 0;
    for (let i = 0; i < section.length; i++) {
        if (section[i] !== "\n") str += section[i];
        else {
            temp = i;
            break;
        }
    }
    for (let i = temp; i < section.length; i++) {
        liquid += section[i];
    }
    try {
        return {
            config: JSON.parse(str),
            liquid: liquid,
        };
    } catch (err) {
        return {
            config: {},
            liquid: liquid,
        };
    }
};

exports.getDataBySectionConfig = async (config) => {
    const result = {};
    const variables = config.variables;
    if (!variables) return result;
    const systemVariables = ["articles"];
    for (let variable of variables) {
        let { name, type, params, items } = variable;
        //Lay du lieu theo ten bien "name" va "params" []
        if (!params) params = {};
        if (!items) items = ["id", "name"];

        const data = await queryGraph(type, name, params, items);
        // console.log(data)
        if (type === "multiple") {
            result[name] = data[name].items;
        }
        if (type === "single") {
            result[name] = data[name];
        }
    }

    return result;
};

exports.renderLiquid = async (engine, section) => {
    const sectionConfig = this.getSectionConfig(section);

    const data = await this.getDataBySectionConfig(sectionConfig.config);

    const renderedSection = await engine.parseAndRender(
        sectionConfig.liquid,
        data
    );

    return renderedSection;
};

exports.getPageInfo = async (eInstance, merchantCode) => {
    const themeInfo = await eInstance.getThemeInfo({
        merchantCode: merchantCode,
    });

    const { scripts, styles } = themeInfo;

    return {
        scripts,
        styles,
    };
};
