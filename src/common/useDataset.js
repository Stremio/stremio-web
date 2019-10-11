const React = require('react');

const useDataset = (props) => {
    props = typeof props === 'object' && props !== null ? props : {};
    const dataPropNames = Object.keys(props).filter(propsName => propsName.startsWith('data-'));
    const dataset = React.useMemo(() => {
        return dataPropNames.reduce((dataset, dataPropName) => {
            dataset[dataPropName.slice(5)] = String(props[dataPropName]);
            return dataset;
        }, {});
    }, [dataPropNames.join('')]);
    return dataset;
};

module.exports = useDataset;
