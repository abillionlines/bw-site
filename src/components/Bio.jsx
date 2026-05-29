import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Bio() {
  const bioRef = useRef(null);

  useEffect(() => {
    const bio = bioRef.current;
    if (!bio) return;

    gsap.set(bio, { opacity: 0, y: 40 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bio,
        start: "top 70%",
        end: "top 25%",
        scrub: 1,
      },
    });
    tl.to(bio, { opacity: 1, y: 0, duration: 1, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section id="bio" className="bio" ref={bioRef}>
      <h2 className="bio__title">Bio</h2>
      <div className="bio__text">
        <p>
          Born in Los Angeles, raised in Boise, Idaho, and growing up in a
          musical family, Brian inherited a love for the great songs of the 60s,
          70s and 80s before he could even speak. He picked up the instrument at
          12, started writing not long after, and had his first EP out by 16.
          Garage jams, DIY recordings, and a restless need to chase something
          real carried him from Idaho to Phoenix, Hollywood, Seattle, Miami and
          back again.
        </p>
        <p>
          He's logged close to 3,000 nights on stage—mostly just him and a
          guitar—across bars, restaurants, listening rooms, and everywhere in
          between. Along the way he's released multiple albums, built a catalog
          of nearly 100 songs, and landed sync placements on Fox, Hulu, Netflix,
          and BYUtv.
        </p>
        <p>
          Brian calls what he does "New Americana"—rooted in tradition but wide
          open enough for modernity. Unity, honesty, and making room for folks
          who don't quite fit the mold. That's the whole point.
        </p>
        <p>
          Still Water is a few gems among a bigger collection of songs recorded
          by Brian over the past couple of years. He plans to release more of
          these in the future. He sees Still Water as a signal; it was the
          biggest reach back to the acoustic guitar since his youth.
        </p>
        <p className="bio__quote-inline">
          "It felt like my young adulthood, until a few years ago, I was always
          reaching for the electric…but something recently shifted and the
          acoustic got me back."
        </p>
        <p>
          He was joined by some top industry talent for the highlighted tracks.
          Co-Writer Kyle Merkley (Toronto), Vocalist Lava Hong (LA), Trumpeter
          Melissa Neff (Phoenix), and Vocalist Holly Payne (Phoenix).
        </p>
      </div>
    </section>
  );
}
