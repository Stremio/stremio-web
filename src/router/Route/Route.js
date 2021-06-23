// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { ModalsContainerProvider } = require('../ModalsContainerContext');
const ServerNotification = require('../../common/ServerNotification');
const UrlUtils = require('url');

const Route = ({ children }) => {
    const { pathname } = UrlUtils.parse(window.location.hash.slice(1));
    return (
        <div className={'route-container'}>
            <ModalsContainerProvider>
                <div className={'route-content'}>
                    {children}
                </div>
                {
                    pathname !== null && (pathname === '/' || pathname.startsWith('/discover') || pathname.startsWith('/library')) ?
                        <ServerNotification />
                        :
                        null
                }
            </ModalsContainerProvider>
        </div>
    );
};

Route.propTypes = {
    children: PropTypes.node
};

module.exports = Route;
