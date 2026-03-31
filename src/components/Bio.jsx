import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Bio() {
  const bioRef = useRef(null);

  useEffect(() => {
    const bio = bioRef.current;
    if (!bio) return;

    const revealStack = bio.closest(".reveal-stack");
    const watchEl = revealStack?.querySelector(".reveal-stack__watch");

    // Bio starts hidden — sitting "behind" the Watch
    gsap.set(bio, {
      opacity: 0,
      y: 40,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: revealStack,
        start: "top+=30% top", // reveal starts at 30% into the stack
        end: "top+=80% top", // reveal fully done by 80% — before pan begins
        scrub: 1.0,
      },
    });

    // Watch fades out
    if (watchEl) {
      tl.to(
        watchEl,
        {
          opacity: 0,
          duration: 0.5,
          ease: "none",
        },
        0,
      );
      tl.set(watchEl, { visibility: "hidden", pointerEvents: "none" }, 0.5);
    }

    // Bio fades and slides in
    tl.to(
      bio,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "none",
      },
      0.1,
    );

    // Pan starts AFTER reveal is done — from 80% to end of stack
    const bioInner = bio;
    const readingTl = gsap.timeline({
      scrollTrigger: {
        trigger: revealStack,
        start: "top+=80% top",
        end: "bottom top",
        scrub: 1,
      },
    });
    readingTl.to(bioInner, {
      y: () => -(bioInner.scrollHeight - window.innerHeight + 80),
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      readingTl.scrollTrigger?.kill();
      readingTl.kill();
    };
  }, []);

  return (
    <section id="bio" className="bio" ref={bioRef}>
      <h2 className="bio__title">Bio</h2>
      <blockquote className="bio__quote">
        "I've always believed you don't have to be cool to be cool. True
        coolness comes from authenticity—and whatever that looks like for you is
        what matters. My journey has been about reaching a place inside myself
        where I could finally receive what the world has been offering all
        along."
      </blockquote>
      <div className="bio__text">
        <p>
          Brian's musical story began before birth: while pregnant, his mother
          played and taught the great guitar songs of the '60s and '70s, shaping
          his ears from the womb. Born in Los Angeles and raised in Boise,
          Idaho, he picked up the guitar at 12—initially to impress girls—and
          discovered a natural talent for playing and songwriting. By 16, he
          released his first EP; by 17, his debut full-length album.
        </p>
        <p>
          His early years were filled with garage jams, DIY studios, and a
          search for artistic and spiritual freedom. At one point, he won a
          Myspace contest for New Line Cinema's <em>Just Friends</em>, landing a
          lucrative spot in their ad campaign with his take on "Jamie
          Smiles"—the biggest music paycheck Boise had ever seen.
        </p>
        <p>
          After two more albums, Brian moved to Phoenix at 22 for a broader view
          of the world, then studied Vocal Performance and Audio Engineering at
          Musicians Institute in Hollywood. Running low on funds, he headed to
          Seattle, where confusion about his path led to a pivotal moment:
          releasing his fourth project while working at the Apple Store, then
          recommitting fully to music back in Phoenix.
        </p>
        <p>
          For years, money wasn't the goal—he didn't earn from music until 15
          years in. In his early thirties, he hit the road hard, performing
          nearly 3,000 nights, mostly solo acoustic, across Phoenix, Miami, and
          beyond. Still writing and recording relentlessly, he reached a turning
          point near 40: refusing to release anything that didn't stand
          shoulder-to-shoulder with the music he loved. He sought mentors,
          refined his craft, and produced a polished 6-song EP born from two
          years of intensive work.
        </p>
        <p>
          Now confident in world-class production, Brian licenses his nearly
          100-song catalog for film and TV (placements on Fox, Hulu, Netflix,
          BYUtv). He pushes "New Americana"—evolving the genre to embrace modern
          movements while honoring its core: unity, standing up when needed,
          stepping back for others, and creating space where everyone feels
          understood and at peace with their differences.
        </p>
        <p>"It's a game I'll keep playing until I retire."</p>
      </div>
    </section>
  );
}
