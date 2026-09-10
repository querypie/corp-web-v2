import Image from "next/image";
import type { CSSProperties } from "react";
import { japanHomeAxCopy } from "@/copy/homeJapan";
import styles from "./JapanPlatformDiagram.module.css";

const copy = japanHomeAxCopy.connectedPlatform;
const productLayout = {
  lingo: { left: 110, top: 232, width: 30, height: 22.5 },
  notepie: { left: 217, top: 38, width: 30, height: 30 },
  corpnavi: { left: 497, top: 38, width: 28, height: 29 },
  linkpie: { left: 610, top: 232, width: 28, height: 28 },
} as const;
const integrationSizes = {
  "internal-data": [21.5, 23.5],
  salesforce: [26, 18],
  jira: [24.375, 24.375],
  "microsoft-365": [24, 26],
  slack: [26, 26],
  systems: [26, 26],
} as const;
const em = (pixels: number) => `${pixels / 16}em`;

function DiagramIcon({ name, width, height, monochrome = false }: {
  name: string;
  width: number;
  height: number;
  monochrome?: boolean;
}) {
  const src = `/assets/pages/home/japan/platform/${name}.svg`;
  const size: CSSProperties = { width: em(width), height: em(height) };

  return monochrome ? (
    <span aria-hidden="true" className="block shrink-0 bg-current" style={{ ...size, maskImage: `url(${src})`, maskSize: "100% 100%", maskRepeat: "no-repeat" }} />
  ) : (
    <Image alt="" aria-hidden="true" className="block shrink-0" height={height} src={src} style={size} width={width} />
  );
}

function ProductCard({ product }: { product: (typeof copy.diagram.products)[number] }) {
  const layout = productLayout[product.id];
  return (
    <li className={`${styles.product} bg-bg text-fg`} style={{ left: em(layout.left), top: em(layout.top) }}>
      <div className={styles.productHeader}>
        <span className={styles.productIcon}>
          <DiagramIcon name={product.id} width={layout.width} height={layout.height} monochrome={product.id === "notepie"} />
        </span>
        <div className={styles.productTitle}>
          <h3>{product.name}</h3>
          <p>{product.category}</p>
        </div>
      </div>
      <ul className={styles.features}>
        {product.features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
    </li>
  );
}

export default function JapanPlatformDiagram() {
  return (
    <figure aria-label={copy.imageAlt} className={styles.container}>
      <div className={styles.canvas}>
        <div aria-hidden="true" className={styles.orbit}>
          <div className={styles.orbitRing}>
            <svg className="block h-full w-full" viewBox="0 0 440 440" fill="none" focusable="false">
              <circle cx="220" cy="220" r="219" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
        <div className={styles.platform}>
          <p className={styles.platformName}>{copy.diagram.platformName}</p>
          <p className={styles.platformDescription}>
            {copy.diagram.platformDescription.map((line) => <span className="block" key={line}>{line}</span>)}
          </p>
        </div>
        <ul className="m-0 list-none p-0">
          {copy.diagram.products.map((product) => <ProductCard key={product.id} product={product} />)}
        </ul>
        <div aria-hidden="true" className={styles.connections}>
          <DiagramIcon name="connections" width={651} height={49} monochrome />
        </div>
        <ul className={styles.integrations}>
          {copy.diagram.integrations.map((integration) => {
            const [width, height] = integrationSizes[integration.id];
            return (
              <li className={`${styles.integration} bg-bg text-fg`} key={integration.id}>
                <span className={styles.integrationIcon}>
                  <DiagramIcon name={integration.id} width={width} height={height} monochrome={integration.id === "internal-data" || integration.id === "systems"} />
                </span>
                <p>{integration.lines.map((line) => <span className="block" key={line}>{line}</span>)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
