type AiGatewayLogoProps = {
  className?: string;
};

export default function AiGatewayLogo({ className }: AiGatewayLogoProps) {
  return <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 790 824"
  >
    <path
      d="M230 0h330l230 824H0L230 0Zm50 265h230v559H280V265Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path d="M335 321h120v131H335z" fill="#F47C20" />
    <path d="M335 489h120v335H335z" fill="currentColor" />
  </svg>;
}
