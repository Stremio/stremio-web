// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Image } = require('stremio/components');
const styles = require('./styles.less');

const ProfileItem = ({ profile, isEditing, onSelect, onDelete }) => {
    const { t } = useTranslation();
    const displayName = profile.email
        ? profile.email.split('@')[0]
        : t('USER', { defaultValue: 'User' });

    const handleClick = React.useCallback((event) => {
        event.stopPropagation();
        if (!isEditing) {
            onSelect(profile);
        }
    }, [isEditing, onSelect, profile]);

    const handleDelete = React.useCallback((event) => {
        event.stopPropagation();
        onDelete(profile);
    }, [onDelete, profile]);

    return (
        <button
            type="button"
            className={classnames(styles['profile-item'], { [styles['editing']]: isEditing })}
            onClick={handleClick}
        >
            <div className={styles['avatar-wrapper']}>
                <Image
                    className={styles['avatar']}
                    src={profile.avatar || require('/images/default_avatar.png')}
                    alt={profile.email}
                />
                {isEditing && (
                    <button
                        className={styles['delete-button']}
                        onClick={handleDelete}
                        title={t('DELETE_PROFILE', { defaultValue: 'Delete profile' })}
                        aria-label={t('DELETE_PROFILE', { defaultValue: 'Delete profile' })}
                    >
                        <Icon className={styles['delete-icon']} name={'close'} />
                    </button>
                )}
            </div>
            <span className={styles['profile-name']}>{displayName}</span>
        </button>
    );
};

ProfileItem.propTypes = {
    profile: PropTypes.shape({
        email: PropTypes.string,
        avatar: PropTypes.string,
        authKey: PropTypes.string,
        settings: PropTypes.object,
        lastActive: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }).isRequired,
    isEditing: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

const AddProfileButton = ({ onClick, t }) => {
    return (
        <button
            type="button"
            className={styles['profile-item']}
            onClick={onClick}
            aria-label={t('ADD_PROFILE', { defaultValue: 'Add new profile' })}
        >
            <div className={classnames(styles['avatar-wrapper'], styles['add-profile-wrapper'])}>
                <Icon className={styles['add-icon']} name={'add'} />
            </div>
        </button>
    );
};

AddProfileButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

const ProfilePicker = ({ profiles = [], onSelectProfile, onAddProfile, onDeleteProfile }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = React.useState(false);

    const toggleEditMode = React.useCallback(() => {
        setIsEditing((prev) => !prev);
    }, []);

    const handleDelete = React.useCallback((profile) => {
        if (onDeleteProfile) {
            onDeleteProfile(profile);
        }
    }, [onDeleteProfile]);

    const title = isEditing
        ? t('MANAGE_PROFILES', { defaultValue: 'Manage Profiles' })
        : t('WHO_IS_WATCHING', { defaultValue: 'Who is watching?' });

    const buttonText = isEditing
        ? t('DONE', { defaultValue: 'DONE' })
        : t('MANAGE_PROFILES', { defaultValue: 'MANAGE PROFILES' });

    return (
        <div className={styles['profile-picker-overlay']}>
            <div className={styles['background-container']} />
            <div className={styles['profile-picker-container']}>
                <h1 className={styles['title']}>{title}</h1>

                <div className={styles['profiles-grid']}>
                    {profiles.map((profile, index) => (
                        <ProfileItem
                            key={profile.email || index}
                            profile={profile}
                            isEditing={isEditing}
                            onSelect={onSelectProfile}
                            onDelete={handleDelete}
                        />
                    ))}
                    {!isEditing && <AddProfileButton onClick={onAddProfile} t={t} />}
                </div>

                <button
                    className={classnames(styles['manage-button'], { [styles['done-button']]: isEditing })}
                    onClick={toggleEditMode}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

ProfilePicker.propTypes = {
    profiles: PropTypes.array,
    onSelectProfile: PropTypes.func,
    onAddProfile: PropTypes.func,
    onDeleteProfile: PropTypes.func
};

module.exports = ProfilePicker;
