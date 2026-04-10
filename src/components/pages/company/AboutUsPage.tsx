import Cta from "../../sections/Cta";

type Investor = {
  alt: string;
  imageSrc: string;
};

type JourneyItem = {
  details: string[];
  year: string;
};

type TeamMember = {
  imageSrc: string;
  linkedinHref: string;
  name: string;
  role: string;
};

type LocationItem = {
  addressLines: string[];
  city: string;
  country: string;
  iconSrc: string;
};

type AboutUsPageProps = {
  companyDescription: string[];
  investors: Investor[];
  investorsTitle: string;
  journeyDescription: string;
  journeyItems: JourneyItem[];
  journeyTitle: string;
  locations: LocationItem[];
  locationsTitle: string;
  mapImageSrc: string;
  teamDescription: string[];
  teamMembers: TeamMember[];
  teamTitle: string;
  title: string[];
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function InvestorLogo({ alt, imageSrc }: Investor) {
  return (
    <div className="flex h-auto w-full max-w-[200px] items-center justify-start">
      <img alt={alt} className="block h-auto w-full max-w-[200px] object-contain" src={imageSrc} />
    </div>
  );
}

function TeamCard({ imageSrc, linkedinHref, name, role }: TeamMember) {
  return (
    /* 팀 멤버 카드 */
    <a
      className="card-hover group grid grid-cols-[minmax(0,1fr)_88px] gap-3 rounded-box bg-bg-content p-4 md:grid-cols-[minmax(0,1fr)_100px] md:p-5"
      href={linkedinHref}
      rel="noreferrer noopener"
      target="_blank"
    >
      <div className="flex min-w-0 flex-col justify-between gap-4 md:gap-5">
        <div className="flex flex-col gap-1">
          <p className="m-0 type-body-lg text-fg">{name}</p>
          <p className="m-0 type-body-md text-mute-fg">{role}</p>
        </div>
        <span className="inline-flex h-6 w-6 opacity-30 transition-opacity group-hover:opacity-100">
          <img alt="LinkedIn" className="h-6 w-6 object-contain" src="/icons/linkedin.svg" />
        </span>
      </div>
      <div className="h-[88px] w-[88px] overflow-hidden rounded-thumb bg-bg-deep md:h-[100px] md:w-[100px]">
        <img
          alt={name}
          className="card-media-motion block h-full w-full object-cover"
          src={imageSrc}
        />
      </div>
    </a>
  );
}

function LocationCard({ addressLines, city, country, iconSrc }: LocationItem) {
  return (
    /* 지역 정보 카드 */
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" aria-hidden="true" className="h-[18px] w-6 object-contain" src={iconSrc} />
        <p className="m-0 type-body-lg text-fg">{city}</p>
      </div>
      <div className="type-body-sm text-mute-fg">
        <p className="m-0">{country}</p>
        {addressLines.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AboutUsPage({
  companyDescription,
  investors,
  investorsTitle,
  journeyDescription,
  journeyItems,
  journeyTitle,
  locations,
  locationsTitle,
  mapImageSrc,
  teamDescription,
  teamMembers,
  teamTitle,
  title,
}: AboutUsPageProps) {
  return (
    <div className="flex w-full flex-col gap-20 px-5 pb-10 md:gap-[160px] md:px-10">
      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-[900px] flex-col gap-20 md:gap-[160px]">
        {/* 회사 소개 상단 */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-[30px]">
          <div className="type-h1 text-fg">
            <p className="m-0 text-mute-fg">{title[0]}</p>
            <p className="m-0">{title[1]}</p>
            <div
              aria-hidden="true"
              className="mt-[30px] h-px w-[60px]"
              style={{
                background:
                  "linear-gradient(90deg, #FF7051 0%, #BA709F 29.81%, #456BF0 100%)",
              }}
            />
          </div>
          <div className="flex flex-col gap-5 sm:gap-6 md:gap-[30px]">
            {companyDescription.map((paragraph) => (
              <p key={paragraph} className="m-0 type-body-lg text-fg">
                {paragraph}
              </p>
            ))}
            <div className="content-thumbnail-frame w-full overflow-hidden rounded-box">
              <img
                alt="Company introduction"
                className="block h-full w-full object-contain"
                src="/images/about-us/company-introduction.jpg"
              />
            </div>
          </div>
        </div>

        {/* 연혁 */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h2 className="m-0 type-h1 text-fg">{journeyTitle}</h2>
          </div>
          <div className="flex flex-col gap-6 md:gap-[30px]">
            {journeyItems.map((item) => (
              <div
                key={item.year}
                className="grid grid-cols-[56px_minmax(0,1fr)] gap-[10px] sm:grid-cols-[60px_minmax(0,1fr)]"
              >
                <p className="m-0 type-h3 text-fg">{item.year}</p>
                <ul className="m-0 flex list-disc flex-col gap-0.5 pl-5 sm:pl-6 type-body-lg text-fg">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 투자사 */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-[30px]">
          <h2 className="m-0 type-h1 text-fg">{investorsTitle}</h2>
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-[40px]">
            {[investors[2], investors[0], investors[1]].filter(Boolean).map((item) => (
              <InvestorLogo key={item.alt} {...item} />
            ))}
          </div>
        </div>

        {/* 팀 */}
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-[30px]">
          <div className="grid gap-[10px] md:grid-cols-2">
            <h2 className="m-0 type-h1 text-fg">{teamTitle}</h2>
            <div className="type-body-md text-fg">
              {teamDescription.map((line) => (
                <p key={line} className="m-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="grid gap-[10px] md:grid-cols-2">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </div>

        {/* 위치 */}
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-[30px]">
          <h2 className="m-0 type-h1 text-fg">{locationsTitle}</h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-[30px]">
            {locations.map((location) => (
              <LocationCard key={`${location.city}-${location.country}`} {...location} />
            ))}
          </div>
          <div className="relative aspect-[1000/480] w-full overflow-hidden md:aspect-[1000/400]">
            <img alt="World locations" className="block h-full w-full object-cover" src={mapImageSrc} />
          </div>
        </div>
        </div>
      </section>
      <Cta />
    </div>
  );
}
