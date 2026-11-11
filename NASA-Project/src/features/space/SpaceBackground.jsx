import { SHOOTING_STARS } from "../../utils/constants";

function SpaceBackground() {
  return (
    <>
      <div className="space-bg" aria-hidden="true" />
      <div className="stars stars--1" aria-hidden="true" />
      <div className="stars stars--2" aria-hidden="true" />

      {SHOOTING_STARS.map((star) => (
        <span
          key={star.id}
          className="shooting-star"
          aria-hidden="true"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.width}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </>
  );
}

export default SpaceBackground;
