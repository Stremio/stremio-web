const React = require('react');
const PropTypes = require('prop-types');
const { Button } = require('stremio/common');
const classnames = require('classnames');
const styles = require('./styles');

const SectionsSelector = ({ className, sections, selectedSectionId, onSelectedSection }) => {
    return (
        <div className={className}>
            {sections.map((section) =>
                <Button key={section.id} className={classnames(styles['section-label'], { [styles['selected']]: selectedSectionId === section.id })} type={'button'} data-section={section.id} onClick={onSelectedSection}>
                    {section.id}
                </Button>
            )}
        </div>
    );
};

SectionsSelector.propTypes = {
    className: PropTypes.string,
    sections: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
    })),
    selectedSectionId: PropTypes.string.isRequired,
    onSelectedSection: PropTypes.func.isRequired,
};

module.exports = SectionsSelector;
