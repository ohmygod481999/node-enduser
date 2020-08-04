const Configuration = require("./config");

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

// exports.renderScriptsAndStyles = (pageInfo) => {
//     return (
//         <Fragment>
//             {pageInfo.styles.map((style, i) => (
//                 <link rel="stylesheet" type="text/css" href={style} />
//             ))}
//             {pageInfo.scripts.map((script, i) => (
//                 <script key={i} src={script}></script>
//             ))}
//         </Fragment>
//     );
// };

exports.sliceString = (string, maxLength = 10) => {
    if (string.length > maxLength) return string.slice(0, maxLength) + " ...";
    return string;
};

exports.getSourceResult = (res) => {
    return res.data.hits.hits.map((val) => val._source);
};

exports.getImageThumbnail = (images = []) => {
    if (images.length < 1)
        return {
            src: Configuration.imageDefault,
            alt: "",
        };
    for (let i = 0; i < images.length; i++) {
        if (images[i].isFeatured)
            return {
                src: Configuration.imageRoot + images[i].path,
                alt: images[i].altAttribute,
            };
    }
    return {
        src: Configuration.imageRoot + images[0].path,
        alt: images[0].altAttribute,
    };
};

exports.cropImage = (imgPath, width, height) => {
    return imgPath + `?mode=Crop&width=${width}&height=${height}`;
};

exports.formatDate = (date) => {
    let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
};
