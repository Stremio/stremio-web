import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Checkbox } from 'stremio-common';
import styles from './styles';

const CheckboxLabel = React.forwardRef(({ className, label, link, href, checked, onClick }, ref) => (
    <label className={classnames(styles['checkbox-label-container'], className)}>
        <div className={styles['checkbox-container']}>
            <Checkbox ref={ref} className={styles['checkbox']} checked={checked} onClick={onClick} />
        </div>
        <div className={styles['label']}>
            {label}
            {link ? <a className={styles['link']} href={href} target={'_blank'} tabIndex={'-1'}> {link}</a> : null}
        </div>
    </label>
));

CheckboxLabel.propTypes = {
    className: PropTypes.string
};

CheckboxLabel.displayName = 'CheckboxLabel';

export default CheckboxLabel;
