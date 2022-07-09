function getId() {
    return Math.random().toString(32).slice(2);
}

function Bridge(context, scope) {
    context.addEventListener('message', async ({ data: { request } }) => {
        if (!request) return;

        const { id, path, args } = request;
        try {
            const object = path.reduce((obj, prop) => obj[prop], scope);
            let data;
            if (typeof object === 'function') {
                const thisArg = path.slice(0, path.length - 1).reduce((obj, prop) => obj[prop], scope);
                data = await object.apply(thisArg, args);
            } else {
                data = await object;
            }

            context.postMessage({ response: { id, result: { data } } });
        } catch (error) {
            context.postMessage({ response: { id, result: { error } } });
        }
    });

    this.call = async (path, args) => {
        const id = getId();
        return new Promise((resolve, reject) => {
            const onMessage = ({ data: { response } }) => {
                if (!response || response.id !== id) return;

                context.removeEventListener('message', onMessage);
                if ('error' in response.result) {
                    reject(response.result.error);
                } else {
                    resolve(response.result.data);
                }
            };
            context.addEventListener('message', onMessage);
            context.postMessage({ request: { id, path, args } });
        });
    };
}

module.exports = Bridge;
