import styled from "styled-components";
import Image from "next/image";
import SocialShareButtons from "../sharedPageSections/SocialShareButtons";
import Button from "../shared/Button";
import FormattedDate from "../shared/FormattedDate";
import { useTranslations } from "next-intl";
import defaultImg from "../../../public/social/solana.jpg";
import { Link } from "@/utils/Link";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  column-gap: 2rem;
  row-gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  .event-img {
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;

    @media (min-width: 768px) {
      width: 500px;
    }
  }
  .event-details {
    flex: 1;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    row-gap: 1.25rem;
  }

  small {
    font-size: 0.875rem;
    line-height: 130%;
  }
`;

const EventsDetailSection = ({ event = null }) => {
  const t = useTranslations();
  if (!event) return null;

  const eventUrl =
    event.platform === "external" ? event.key : event.rsvp || event.lumaUrl;

  let isSolanaDomain = false;
  if (eventUrl) {
    try {
      // Try parsing as absolute URL first
      const urlObj = new URL(
        eventUrl,
        typeof window !== "undefined" ? window.location.origin : "https://solana.com"
      );
      const host = urlObj.hostname;
      isSolanaDomain =
        host === "solana.com" || host.endsWith(".solana.com");
    } catch (e) {
      // If parsing fails, treat as external
      isSolanaDomain = false;
    }
  }

  return (
    <StyledSection className="my-10">
      <div className="event-img">
        <Link
          target="_blank"
          rel={isSolanaDomain ? undefined : "nofollow"}
          to={eventUrl}
        >
          <Image
            alt={event?.img?.primary?.alt || event.title}
            src={event?.img?.primary || defaultImg}
            fill
          />
        </Link>
      </div>
      <div className="event-details">
        <small>
          {event?.schedule?.from && (
            <FormattedDate
              date={event?.schedule?.from}
              format="E, MMM d"
              timezone={event?.schedule?.timezone}
            />
          )}
          {event?.schedule?.to &&
            new Date(event?.schedule?.from).getDay() !==
              new Date(event?.schedule?.to).getDay() && (
              <>
                <span className="mx-1">-</span>
                <FormattedDate
                  date={event?.schedule?.to}
                  format="E, MMM d"
                  timezone={event?.schedule?.timezone}
                />
              </>
            )}
        </small>
        <h2 className="h4">{event.title}</h2>
        <small>{event.description}</small>
        <Button
          to={eventUrl}
          arrow={true}
          newTab
          rel={isSolanaDomain ? undefined : "nofollow"}
        >
          {t("events.detail.action")}
        </Button>
        <SocialShareButtons
          url={eventUrl}
          title={event.title}
          className="mt-2"
        />
      </div>
    </StyledSection>
  );
};

export default EventsDetailSection;
