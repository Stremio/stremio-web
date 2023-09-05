{
  compact && typeof description === "string" && description.length > 0 ? (
    <div className={styles["description-container"]}>{description}</div>
  ) : null;
}
