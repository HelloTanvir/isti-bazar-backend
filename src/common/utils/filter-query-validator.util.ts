export const getValidFilterQuery = (filterQuery: any) => {
    Object.keys(filterQuery).forEach((key) => {
        // if any filter query option is empty, remove it from filter query
        if (
            filterQuery[key] === '' ||
            filterQuery[key] === null ||
            filterQuery[key] === undefined
        ) {
            delete filterQuery[key];
        } else if (key === 'startDate') {
            // if filter query option has startDate, convert this to Date object according to mongodb format
            filterQuery.updatedAt = {
                ...filterQuery.updatedAt,
                $gte: new Date(filterQuery.startDate),
            };
        } else if (key === 'endDate') {
            // if filter query option has endDate, convert this to Date object according to mongodb format
            filterQuery.updatedAt = {
                ...filterQuery.updatedAt,
                $lte: new Date(filterQuery.endDate),
            };
        } else {
            // if filter query option is not empty, convert this to RegExp object and structure it according to mongodb format
            const filterRegExp = new RegExp(filterQuery[key], 'i');
            filterQuery[key] = { $regex: filterRegExp };
        }
    });

    return filterQuery;
};
