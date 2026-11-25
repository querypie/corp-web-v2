type AiGatewayLogoProps = {
  className?: string;
  size?: number;
};

export default function AiGatewayLogo({ className, size = 28 }: AiGatewayLogoProps) {
  return <img
    className={className}
    src="/assets/icons/logo-AIG.svg"
    alt=""
    width={size}
    height={size}
  />;
}
