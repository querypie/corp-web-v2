type HeroProps = {
  imageAlt: string;
  imageSrc: string;
};

export default function Hero({
  imageAlt,
  imageSrc,
}: HeroProps) {
  return (
    <section className="flex w-full justify-center">
      <div className="flex w-full max-w-[1200px] justify-center overflow-hidden rounded-box bg-bg-deep py-10">
        <img
          alt={imageAlt}
          className="block h-auto w-full max-w-[1054px] object-contain"
          src={imageSrc}
        />
      </div>
    </section>
  );
}
