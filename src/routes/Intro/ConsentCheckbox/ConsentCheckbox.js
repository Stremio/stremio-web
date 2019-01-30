import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Checkbox } from 'stremio-common';
import styles from './styles';

const ConsentCheckbox = React.forwardRef(({ className, label, link, href, checked, onClick }, ref) => (
    <label className={classnames(styles['consent-checkbox-container'], className)}>
        <Checkbox ref={ref} className={styles['checkbox']} checked={checked} onClick={onClick} />
        <div className={styles['label']}>
            {label}
            {link && href ? <a className={styles['link']} href={href} target={'_blank'} tabIndex={'-1'}> {link}</a> : null}
        </div>
    </label>
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
