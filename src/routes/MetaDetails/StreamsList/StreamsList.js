// Copyright (C) 2017-2022 Smart code 203358507

const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");
const Icon = require("@stremio/stremio-icons/dom");
const { Button, Image, Multiselect } = require("stremio/common");
const { useServices } = require("stremio/services");
const Stream = require("./Stream");
const styles = require("./styles");

const ALL_ADDONS_KEY = "ALL";

const StreamsList = ({ className, ...props }) => {
  const { core } = useServices();
  const [selectedAddon, setSelectedAddon] = React.useState(ALL_ADDONS_KEY);
  const onAddonSelected = React.useCallback((event) => {
    setSelectedAddon(event.value);
  }, []);
  const streamsByAddon = React.useMemo(() => {
    return props.streams
      .filter((streams) => streams.content.type === "Ready")
      .reduce((streamsByAddon, streams) => {
        streamsByAddon[streams.addon.transportUrl] = {
          addon: streams.addon,
          streams: streams.content.content.map((stream) => ({
            ...stream,
            onClick: () => {
              core.transport.analytics({
                event: "StreamClicked",
                args: {
                  stream,
                },
              });
            },
            addonName: streams.addon.manifest.name,
          })),
        };

        return streamsByAddon;
      }, {});
  }, [props.streams]);
  const filteredStreams = React.useMemo(() => {
    return selectedAddon === ALL_ADDONS_KEY
      ? Object.values(streamsByAddon)
          .map(({ streams }) => streams)
          .flat(1)
      : streamsByAddon[selectedAddon]
      ? streamsByAddon[selectedAddon].streams
      : [];
  }, [streamsByAddon, selectedAddon]);
  const selectableOptions = React.useMemo(() => {
    return {
      title: "Select Addon",
      options: [
        {
          value: ALL_ADDONS_KEY,
          label: "All",
          title: "All",
        },
        ...Object.keys(streamsByAddon).map((transportUrl) => ({
          value: transportUrl,
          label: streamsByAddon[transportUrl].addon.manifest.name,
          title: streamsByAddon[transportUrl].addon.manifest.name,
        })),
      ],
      selected: [selectedAddon],
      onSelect: onAddonSelected,
    };
  }, [streamsByAddon, selectedAddon]);
  return (
    <div className={classnames(className, styles["streams-list-container"])}>
      {props.streams.length === 0 ? (
        <div className={styles["message-container"]}>
          <Image
            className={styles["image"]}
            src={require("/images/empty.png")}
            alt={" "}
          />
          <div className={styles["label"]}>
            No addons were requested for streams!
          </div>
        </div>
      ) : props.streams.every((streams) => streams.content.type === "Err") ? (
        <div className={styles["message-container"]}>
          <Image
            className={styles["image"]}
            src={require("/images/empty.png")}
            alt={" "}
          />
          <div className={styles["label"]}>No streams were found!</div>
        </div>
      ) : filteredStreams.length === 0 ? (
        <div className={styles["streams-container"]}>
          <Stream.Placeholder />
          <Stream.Placeholder />
        </div>
      ) : (
        <React.Fragment>
          {Object.keys(streamsByAddon).length > 1 ? (
            <Multiselect
              {...selectableOptions}
              className={styles["select-input-container"]}
            />
          ) : null}
          <div className={styles["streams-container"]}>
            {filteredStreams.map((stream, index) => (
              <Stream
                key={index}
                addonName={stream.addonName}
                name={stream.name}
                description={stream.description}
                thumbnail={stream.thumbnail}
                progress={stream.progress}
                deepLinks={stream.deepLinks}
                onClick={stream.onClick}
              />
            ))}
          </div>
        </React.Fragment>
      )}
      <Button
        className={styles["install-button-container"]}
        title={"Install Addons"}
        href={"#/addons"}
      >
        <Icon className={styles["icon"]} icon={"ic_addons"} />
        <div className={styles["label"]}>Install Addons</div>
      </Button>
    </div>
  );
};

StreamsList.propTypes = {
  className: PropTypes.string,
  streams: PropTypes.arrayOf(PropTypes.object).isRequired,
};

module.exports = StreamsList;
