const utils = {
    url (base, params) {
        const url = new URL(base);
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
        return url;
    }
};

module.exports.url = utils.url;
