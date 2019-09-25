const React = require('react');
const { Button, Dropdown, Checkbox, ColorInput } = require('stremio/common');
const Icon = require('stremio-icons/dom/Icon');
const classnames = require('classnames');
const styles = require('../styles');

const SectionsList = React.forwardRef(({className, sections, preferences, onPreferenceChanged, onScroll }, ref) => {
    const scrollContainerRef = ref;
    const toggleCheckbox = (id) => {
        onPreferenceChanged(id, !preferences[id]);
    };

    const colorChanged = (id, color) => {
        onPreferenceChanged(id, color);
    };

    const updateDropdown = (event) => {
        var data = event.currentTarget.dataset;
        onPreferenceChanged(data.name, data.value);
    };

    return (
        <div ref={scrollContainerRef} className={className} onScroll={onScroll}>
            {sections.map((section) =>
                <div key={section.id} ref={section.ref} className={styles['section']} data-section={section.id}>
                    <div className={styles['section-header']}>{section.id}</div>
                    {(section.inputs || [])
                        .map((input) => {
                            if (input.type === 'user') {
                                return (
                                    <div key={input.id} className={classnames(styles['input-container'], styles['user-container'])}>
                                        {
                                            !preferences[input.id]
                                                ?
                                                <div style={{ backgroundImage: `url('/images/anonymous.png')` }} className={styles['avatar']} />
                                                :
                                                <div style={{ backgroundImage: `url('${this.props.avatar}'), url('/images/default_avatar.png')` }} className={styles['avatar']} />
                                        }
                                        <div className={styles['email']}>{!preferences[input.id] ? 'Anonymous user' : preferences[input.id].email}</div>
                                    </div>
                                );
                            } else if (input.type === 'select') {
                                return (
                                    <div key={input.id} className={classnames(styles['input-container'], styles['select-container'])}>
                                        {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                        <Dropdown options={input.options} selected={[preferences[input.id]]} name={input.id} key={input.id} className={styles['dropdown']} onSelect={updateDropdown} />
                                    </div>
                                );
                            } else if (input.type === 'link') {
                                return (
                                    <div key={input.id} className={classnames(styles['input-container'], styles['link-container'])}>
                                        {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                        <Button ref={input.ref} className={styles['link']} type={input.type} href={input.href} target={'_blank'}>
                                            <div className={styles['label']}>{input.label}</div>
                                        </Button>
                                    </div>
                                );
                            } else if (input.type === 'button') {
                                return (
                                    <div key={input.id} className={classnames(styles['input-container'], styles['button-container'])}>
                                        {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                        <Button ref={input.ref} className={styles['button']} type={input.type}>
                                            {input.icon ? <Icon className={styles['icon']} icon={input.icon} /> : null}
                                            <div className={styles['label']}>{input.label}</div>
                                        </Button>
                                    </div>
                                );
                            } else if (input.type === 'checkbox') {
                                return (
                                    <div key={input.id} className={classnames(styles['input-container'], styles['checkbox-container'])}>
                                        {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                        <Checkbox ref={input.ref} className={styles['checkbox']} checked={preferences[input.id]} onClick={toggleCheckbox.bind(null, input.id)}>
                                            <div className={styles['label']}>{input.label}</div>
                                        </Checkbox>
                                    </div>
                                );
                            } else if (input.type === 'static-text') {
                                return (
                                    <div key={input.id} className={classnames(styles['input-container'], styles['text-container'])}>
                                        {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                        <div className={styles['text']}>
                                            {input.icon ? <Icon className={styles[input.icon === 'ic_x' ? 'x-icon' : 'icon']} icon={input.icon} /> : null}
                                            <div className={styles['label']}>{input.label}</div>
                                        </div>
                                    </div>
                                );
                            } else if (input.type === 'color') {
                                return (
                                    <div key={input.id} className={classnames(styles['input-container'], styles['color-container'])}>
                                        {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                        <ColorInput className={styles['color-picker']} defaultValue={preferences[input.id]} tabIndex={'-1'} onChange={colorChanged.bind(null, input.id)} />
                                        {/* <TextInput className={styles['color-picker']} type={input.type} defaultValue={input.color} tabIndex={'-1'} /> */}
                                    </div>
                                );
                            }
                        })}
                </div>
            )}
        </div>
    );
});

module.exports = SectionsList;