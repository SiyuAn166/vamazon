
function minMaxScaler(value, inputMin, inputMax, outputMin, outputMax) {
    const scaledValue = ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    return scaledValue;
}


export const makeDataForBubble = (data) => {
    let rows = data.map(row => ({
        group: row.category,
        rating: row.overall
    }));

    let groupedData = rows.reduce((acc, item) => {
        const key = `${item.group}_${item.rating}`;
        if (!acc[key]) {
            acc[key] = { count: 0, value: 0, data: [] };
        }
        acc[key].count += 1;
        acc[key].data.push(item);
        return acc;
    }, {});

    const formattedData = Object.entries(groupedData).map(([key, value]) => ({
        group: key.split('_')[0],
        rating: parseInt(key.split('_')[1]),
        count: value.count,
    }));

    const countArray = formattedData.map(item => item.count);
    const countMin = Math.min(...countArray);
    const countMax = Math.max(...countArray);

    const scaledData = formattedData.map(item => ({
        ...item,
        value: minMaxScaler(item.count, countMin, countMax, 6, 46),
    }));
    let dataForBubble = {
        nodes: scaledData
    };

    return dataForBubble;
}

export const makeDataForText = (data) => {
    let rows = data.map(row => ({
        group: row.category,
        rating: row.overall,
        text: JSON.parse(row.keywords.replace(/'/g, '"'))[0]
    }));

    const groupedData = rows.reduce((acc, item) => {
        const key = `${item.group}_${item.rating}`;
        if (!acc[key]) {
            acc[key] = { group: item.group, rating: item.rating, count: 0, text: item.text };
        }
        acc[key].count += 1;
        return acc;
    }, {});

    const mappedData = Object.entries(groupedData).map(([key, value])=>({
        ...value
    }));

    const countArray = mappedData.map(item => item.count);
    const countMin = Math.min(...countArray);
    const countMax = Math.max(...countArray);

    const dataForText = mappedData.map(item =>({
        ...item,
        value: minMaxScaler(item.count, countMin, countMax, 16, 46)
    }) )
    return dataForText;
}

