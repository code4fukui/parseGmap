const parseGmap = (url) => {
    //console.log(url);
    // !3d35.9246749!4d136.1843777
    const n = url.lastIndexOf("!3d");
    const m = url.lastIndexOf("!4d");
    const l = url.indexOf("!", m + 2);
    const lat = url.substring(n + 3, m);
    const lng = url.substring(m + 3, l < 0 ? url.length : l);
    return [lat, lng];
};
export { parseGmap };
