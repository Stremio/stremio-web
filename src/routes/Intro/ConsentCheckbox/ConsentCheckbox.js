import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Checkbox } from 'stremio-common';
import styles from './styles';

const linkOnClick = (event) => {
    event.stopPropagation();
};

const ConsentCheckbox = React.forwardRef(({ className, label, link, href, checked, onClick }, ref) => (
    <Checkbox ref={ref} className={classnames(styles['consent-checkbox-container'], className)} checked={checked} onClick={onClick}>
        <div className={styles['label']}>
            {label}
            {link && href ? <a className={styles['link']} href={href} target={'_blank'} tabIndex={'-1'} onClick={linkOnClick}> {link}</a> : null}
        </div>
    </Checkbox>
));

ConsentCheckbox.displayName = 'ConsentCheckbox';

ConsentCheckbox.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    label: PropTypes.string,
    link: PropTypes.string,
    href: PropTypes.string,
    checked: PropTypes.bool
};

export default ConsentCheckbox;
