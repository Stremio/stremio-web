// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useFetchNotificationData = () => {
    const [notificationModalData, setNotificationModalData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://api.strem.io/api/getModal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ date: new Date() })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const jsonData = await response.json();
                const data = jsonData.result;
                setNotificationModalData(data);
            } catch (err) {
                throw new Error(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { notificationModalData, isLoading };
};

module.exports = useFetchNotificationData;
