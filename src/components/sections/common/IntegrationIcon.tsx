type IntegrationIconProps = {
  className?: string;
  darkPlate?: boolean;
  enhanceIconContrast?: boolean;
  icon: string;
  imageClassName?: string;
  invertIcon?: boolean;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function IntegrationIcon({
  className,
  darkPlate,
  enhanceIconContrast,
  icon,
  imageClassName,
  invertIcon,
}: IntegrationIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex shrink-0 items-center justify-center overflow-hidden",
        darkPlate && "theme-dark-icon-plate",
        className,
      )}
    >
      <img
        alt=""
        className={cx(
          "block h-auto max-h-full w-auto max-w-full object-contain",
          invertIcon && "theme-invert-on-dark",
          enhanceIconContrast && "theme-enhance-on-dark",
          imageClassName,
        )}
        src={icon}
      />
    </span>
  );
}
