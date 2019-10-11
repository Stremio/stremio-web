const React = require('react');

const toCamelCase = (value) => {
    return value.replace(/-([a-z])/gi, (_, letter) => letter.toUpperCase());
};

const useDataset = (props) => {
    props = typeof props === 'object' && props !== null ? props : {};
    const dataPropNames = Object.keys(props).filter(propsName => propsName.startsWith('data-'));
    const dataset = React.useMemo(() => {
        return dataPropNames.reduce((dataset, dataPropName) => {
            const datasetPropName = toCamelCase(dataPropName.slice(5));
            dataset[datasetPropName] = String(props[dataPropName]);
            return dataset;
        }, {});
    }, [dataPropNames.join('')]);
    return dataset;
};

module.exports = useDataset;
