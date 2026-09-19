import React from 'react';

interface SpriteProps {
  name: string;
  className?: string;
  size?: number;
  silhouette?: boolean;
}

export const PixelSprite: React.FC<SpriteProps> = ({
  name,
  className = '',
  size = 64,
  silhouette = false,
}) => {
  const silClass = silhouette ? 'brightness-0 contrast-200 opacity-80' : '';

  switch (name) {
    case 'ibarbash':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cap Red & Black */}
          <rect x="10" y="4" width="12" height="4" fill="#dc2626" />
          <rect x="8" y="6" width="16" height="3" fill="#dc2626" />
          <rect x="16" y="7" width="9" height="2" fill="#18181b" />
          <rect x="12" y="5" width="2" height="2" fill="#fff" />
          {/* Face */}
          <rect x="10" y="9" width="12" height="7" fill="#fcd34d" />
          <rect x="8" y="10" width="2" height="5" fill="#78350f" /> {/* hair */}
          <rect x="22" y="10" width="2" height="5" fill="#78350f" />
          {/* Eyes */}
          <rect x="12" y="11" width="2" height="3" fill="#18181b" />
          <rect x="18" y="11" width="2" height="3" fill="#18181b" />
          <rect x="12" y="11" width="1" height="1" fill="#fff" />
          <rect x="18" y="11" width="1" height="1" fill="#fff" />
          {/* Smile */}
          <rect x="14" y="14" width="4" height="1" fill="#b91c1c" />
          {/* Red/Black Scarf */}
          <rect x="9" y="16" width="14" height="3" fill="#dc2626" />
          <rect x="11" y="16" width="3" height="3" fill="#18181b" />
          <rect x="17" y="16" width="3" height="3" fill="#18181b" />
          <rect x="14" y="19" width="4" height="4" fill="#dc2626" />
          <rect x="14" y="21" width="4" height="2" fill="#18181b" />
          {/* Jacket Red & Black */}
          <rect x="8" y="19" width="16" height="7" fill="#dc2626" />
          <rect x="12" y="19" width="8" height="7" fill="#18181b" />
          <rect x="6" y="20" width="2" height="5" fill="#dc2626" />
          <rect x="24" y="20" width="2" height="5" fill="#dc2626" />
          {/* Hands */}
          <rect x="6" y="25" width="2" height="2" fill="#fcd34d" />
          <rect x="24" y="25" width="2" height="2" fill="#fcd34d" />
          {/* Shorts / Pants */}
          <rect x="10" y="26" width="12" height="3" fill="#27272a" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    case 'team_r_leader':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hair Blue Punk */}
          <rect x="9" y="3" width="14" height="5" fill="#2563eb" />
          <rect x="7" y="5" width="4" height="6" fill="#1d4ed8" />
          <rect x="21" y="5" width="4" height="6" fill="#1d4ed8" />
          {/* Face */}
          <rect x="10" y="8" width="12" height="7" fill="#fed7aa" />
          {/* Smirk & Sunglasses */}
          <rect x="11" y="10" width="10" height="3" fill="#0f172a" />
          <rect x="12" y="11" width="3" height="1" fill="#38bdf8" />
          <rect x="17" y="11" width="3" height="1" fill="#38bdf8" />
          <rect x="14" y="14" width="4" height="1" fill="#991b1b" />
          {/* Suit Yellow and Blue */}
          <rect x="8" y="16" width="16" height="10" fill="#eab308" />
          <rect x="6" y="17" width="2" height="7" fill="#1e3a8a" />
          <rect x="24" y="17" width="2" height="7" fill="#1e3a8a" />
          {/* BIG 'R' ON CHEST */}
          <rect x="13" y="18" width="2" height="6" fill="#1e40af" />
          <rect x="15" y="18" width="4" height="2" fill="#1e40af" />
          <rect x="17" y="20" width="2" height="2" fill="#1e40af" />
          <rect x="15" y="21" width="3" height="1" fill="#1e40af" />
          <rect x="16" y="22" width="2" height="2" fill="#1e40af" />
          {/* Pants Blue */}
          <rect x="10" y="26" width="12" height="6" fill="#1e3a8a" />
        </svg>
      );

    case 'team_r_grunt':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Yellow Beanie with Blue Trim */}
          <rect x="10" y="4" width="12" height="5" fill="#facc15" />
          <rect x="9" y="8" width="14" height="2" fill="#2563eb" />
          {/* Face */}
          <rect x="10" y="10" width="12" height="6" fill="#fde047" />
          {/* Eyes with mischievous look */}
          <rect x="12" y="12" width="2" height="2" fill="#1e293b" />
          <rect x="18" y="12" width="2" height="2" fill="#1e293b" />
          <rect x="13" y="15" width="6" height="1" fill="#1e293b" />
          {/* Yellow/Blue Uniform */}
          <rect x="8" y="16" width="16" height="9" fill="#2563eb" />
          <rect x="12" y="17" width="8" height="7" fill="#facc15" />
          {/* Mini 'R' */}
          <rect x="14" y="18" width="2" height="4" fill="#1e3a8a" />
          <rect x="16" y="18" width="2" height="2" fill="#1e3a8a" />
          <rect x="16" y="21" width="2" height="1" fill="#1e3a8a" />
          {/* Boots */}
          <rect x="10" y="25" width="4" height="7" fill="#0f172a" />
          <rect x="18" y="25" width="4" height="7" fill="#0f172a" />
        </svg>
      );

    case 'mitxitzel':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cat Ears */}
          <polygon points="8,4 12,4 8,9" fill="#f59e0b" />
          <polygon points="24,4 20,4 24,9" fill="#f59e0b" />
          <polygon points="9,5 11,5 9,8" fill="#f43f5e" />
          <polygon points="23,5 21,5 23,8" fill="#f43f5e" />
          {/* Head Orange/Ginger */}
          <rect x="8" y="8" width="16" height="10" fill="#f59e0b" />
          {/* White Muzzle */}
          <rect x="12" y="13" width="8" height="5" fill="#fef08a" />
          {/* Cat Big Eyes Yellow/Blue */}
          <rect x="10" y="10" width="3" height="3" fill="#22c55e" />
          <rect x="19" y="10" width="3" height="3" fill="#3b82f6" />
          <rect x="11" y="11" width="1" height="2" fill="#000" />
          <rect x="20" y="11" width="1" height="2" fill="#000" />
          {/* Nose & Whiskers */}
          <rect x="15" y="14" width="2" height="1" fill="#ec4899" />
          <rect x="6" y="13" width="3" height="1" fill="#475569" />
          <rect x="6" y="15" width="3" height="1" fill="#475569" />
          <rect x="23" y="13" width="3" height="1" fill="#475569" />
          <rect x="23" y="15" width="3" height="1" fill="#475569" />
          {/* Blue/Yellow Bandana */}
          <rect x="9" y="18" width="14" height="2" fill="#2563eb" />
          <polygon points="14,20 18,20 16,23" fill="#facc15" />
          {/* Body */}
          <rect x="10" y="20" width="12" height="8" fill="#f59e0b" />
          {/* Paws */}
          <rect x="10" y="28" width="4" height="4" fill="#fef08a" />
          <rect x="18" y="28" width="4" height="4" fill="#fef08a" />
          {/* Tail */}
          <rect x="22" y="22" width="3" height="2" fill="#d97706" />
          <rect x="24" y="20" width="3" height="2" fill="#d97706" />
          <rect x="25" y="17" width="3" height="3" fill="#d97706" />
        </svg>
      );

    case 'coach_patxi':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cap & Grey Hair */}
          <rect x="9" y="4" width="14" height="4" fill="#18181b" />
          <rect x="16" y="6" width="9" height="2" fill="#dc2626" />
          <rect x="8" y="8" width="3" height="4" fill="#9ca3af" />
          <rect x="21" y="8" width="3" height="4" fill="#9ca3af" />
          {/* Face */}
          <rect x="10" y="8" width="12" height="7" fill="#fcd34d" />
          {/* Eyes & Mustache */}
          <rect x="12" y="10" width="2" height="2" fill="#18181b" />
          <rect x="18" y="10" width="2" height="2" fill="#18181b" />
          <rect x="11" y="13" width="10" height="2" fill="#4b5563" />
          {/* Whistle on neck */}
          <rect x="14" y="15" width="4" height="2" fill="#cbd5e1" />
          {/* Coach Tracksuit */}
          <rect x="8" y="17" width="16" height="9" fill="#dc2626" />
          <rect x="15" y="17" width="2" height="9" fill="#fff" />
          {/* Tactical Clipboard */}
          <rect x="6" y="20" width="4" height="6" fill="#78350f" />
          <rect x="7" y="21" width="2" height="4" fill="#f8fafc" />
          {/* Pants */}
          <rect x="10" y="26" width="12" height="6" fill="#18181b" />
        </svg>
      );

    case 'presi_joseba':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hair & Glasses */}
          <rect x="9" y="4" width="14" height="5" fill="#64748b" />
          <rect x="10" y="9" width="12" height="7" fill="#fed7aa" />
          <rect x="11" y="10" width="4" height="3" fill="#000" />
          <rect x="17" y="10" width="4" height="3" fill="#000" />
          <rect x="12" y="11" width="2" height="1" fill="#38bdf8" />
          <rect x="18" y="11" width="2" height="1" fill="#38bdf8" />
          <rect x="15" y="11" width="2" height="1" fill="#000" />
          <rect x="13" y="14" width="6" height="2" fill="#334155" />
          {/* Blazer & Red Tie */}
          <rect x="8" y="16" width="16" height="10" fill="#18181b" />
          <rect x="13" y="16" width="6" height="5" fill="#ffffff" />
          <rect x="15" y="17" width="2" height="6" fill="#dc2626" />
          {/* Pennant / Banderín in hand */}
          <polygon points="24,19 28,16 28,22" fill="#dc2626" />
          <rect x="23" y="18" width="1" height="8" fill="#eab308" />
          {/* Pants */}
          <rect x="10" y="26" width="12" height="6" fill="#3f3f46" />
        </svg>
      );

    case 'capitan_aitor':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blonde Hair */}
          <rect x="9" y="4" width="14" height="5" fill="#eab308" />
          <rect x="10" y="8" width="12" height="7" fill="#fed7aa" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#991b1b" />
          {/* Soto Red/Black Jersey #10 */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="10" y="15" width="3" height="10" fill="#18181b" />
          <rect x="16" y="15" width="3" height="10" fill="#18181b" />
          {/* Captain Armband Yellow */}
          <rect x="6" y="17" width="2" height="3" fill="#facc15" />
          <rect x="6" y="18" width="2" height="1" fill="#000" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    // --- PORTEROS DEL SOTO ---
    case 'player_estenaga':
    case 'player_nagore':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Goalkeeper with dark brown hair and green/black keeper kit */}
          <rect x="10" y="4" width="12" height="4" fill="#451a03" />
          <rect x="9" y="7" width="14" height="2" fill="#451a03" />
          <rect x="10" y="8" width="12" height="7" fill="#fed7aa" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#b91c1c" />
          {/* Neon Green & Black Goalkeeper Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#16a34a" />
          <rect x="12" y="15" width="8" height="10" fill="#15803d" />
          <rect x="8" y="17" width="16" height="2" fill="#18181b" />
          {/* Yellow Goalie Gloves */}
          <rect x="6" y="18" width="3" height="4" fill="#facc15" />
          <rect x="23" y="18" width="3" height="4" fill="#facc15" />
          {/* Shorts & Socks */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#16a34a" />
          <rect x="17" y="29" width="4" height="3" fill="#16a34a" />
        </svg>
      );

    // --- DEFENSAS DEL SOTO ---
    case 'player_agorreta':
    case 'player_arbizu':
    case 'player_quintana':
    case 'player_ali':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Brown Hair with Strong Jaw */}
          <rect x="9" y="4" width="14" height="5" fill="#78350f" />
          <rect x="10" y="8" width="12" height="7" fill="#fcd34d" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#7f1d1d" />
          {/* Soto Red & Black Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="10" y="15" width="3" height="10" fill="#18181b" />
          <rect x="16" y="15" width="3" height="10" fill="#18181b" />
          <rect x="22" y="15" width="2" height="10" fill="#18181b" />
          {/* White Wristband on Right Arm */}
          <rect x="6" y="19" width="2" height="2" fill="#f8fafc" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    case 'player_escobar':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dark Taper Fade Hair & Warm Tone */}
          <rect x="9" y="4" width="14" height="4" fill="#171717" />
          <rect x="8" y="7" width="16" height="2" fill="#171717" />
          <rect x="10" y="8" width="12" height="7" fill="#b45309" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#78350f" />
          {/* Soto Red & Black Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="11" y="15" width="3" height="10" fill="#18181b" />
          <rect x="17" y="15" width="3" height="10" fill="#18181b" />
          {/* Muscle arms */}
          <rect x="6" y="16" width="2" height="7" fill="#b45309" />
          <rect x="24" y="16" width="2" height="7" fill="#b45309" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    case 'player_garde':
    case 'player_larrea':
    case 'player_perez':
    case 'player_solis_i':
    case 'player_tainta':
    case 'player_unzueta':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lateral runner with head band */}
          <rect x="9" y="4" width="14" height="4" fill="#92400e" />
          <rect x="8" y="7" width="16" height="2" fill="#ffffff" /> {/* white headband */}
          <rect x="10" y="9" width="12" height="6" fill="#fed7aa" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#991b1b" />
          {/* Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="10" y="15" width="3" height="10" fill="#18181b" />
          <rect x="16" y="15" width="3" height="10" fill="#18181b" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    case 'player_redin':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Redin - Legendary Defender/Clutch Hero with Black Hair & Red Headband */}
          <rect x="9" y="3" width="14" height="4" fill="#18181b" />
          <rect x="8" y="6" width="16" height="2" fill="#dc2626" />
          <rect x="10" y="8" width="12" height="7" fill="#fcd34d" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#b91c1c" />
          {/* Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="10" y="15" width="3" height="10" fill="#18181b" />
          <rect x="16" y="15" width="3" height="10" fill="#18181b" />
          {/* Golden Badge Accent on chest */}
          <rect x="14" y="16" width="2" height="2" fill="#facc15" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    // --- CENTROCAMPISTAS DEL SOTO ---
    case 'player_ayesa':
    case 'player_landa':
    case 'player_letamendi':
    case 'player_tollar':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Midfield Commander */}
          <rect x="9" y="4" width="14" height="4" fill="#27272a" />
          <rect x="8" y="7" width="16" height="2" fill="#27272a" />
          <rect x="10" y="8" width="12" height="7" fill="#fed7aa" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#991b1b" />
          {/* Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="11" y="15" width="4" height="10" fill="#18181b" />
          <rect x="18" y="15" width="4" height="10" fill="#18181b" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    case 'player_martinez':
    case 'player_ortiz':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Playmaker with stylish hair */}
          <rect x="10" y="3" width="12" height="4" fill="#b45309" />
          <rect x="8" y="6" width="16" height="3" fill="#b45309" />
          <rect x="10" y="8" width="12" height="7" fill="#fed7aa" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#991b1b" />
          {/* Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="10" y="15" width="3" height="10" fill="#18181b" />
          <rect x="16" y="15" width="3" height="10" fill="#18181b" />
          {/* Gold wristband */}
          <rect x="24" y="20" width="2" height="2" fill="#eab308" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    // --- DELANTEROS DEL SOTO ---
    case 'player_algarra':
    case 'player_rodriguez':
    case 'player_sanz':
    case 'player_solis_a':
    case 'player_letamendi_a':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Striker in celebration posture */}
          <rect x="9" y="4" width="14" height="4" fill="#1c1917" />
          <rect x="8" y="7" width="16" height="2" fill="#1c1917" />
          <rect x="10" y="8" width="12" height="7" fill="#fcd34d" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#dc2626" />
          {/* Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="10" y="15" width="3" height="10" fill="#18181b" />
          <rect x="16" y="15" width="3" height="10" fill="#18181b" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    case 'player_ruiz':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Iker Ruiz - Electric Striker with Blonde highlight & dynamic look */}
          <rect x="9" y="3" width="14" height="4" fill="#451a03" />
          <rect x="11" y="3" width="5" height="2" fill="#facc15" /> {/* blonde tip */}
          <rect x="8" y="6" width="16" height="3" fill="#451a03" />
          <rect x="10" y="8" width="12" height="7" fill="#fed7aa" />
          <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
          <rect x="14" y="13" width="4" height="1" fill="#b91c1c" />
          {/* Jersey with #7 flare */}
          <rect x="8" y="15" width="16" height="10" fill="#dc2626" />
          <rect x="10" y="15" width="3" height="10" fill="#18181b" />
          <rect x="16" y="15" width="3" height="10" fill="#18181b" />
          {/* Red wristbands */}
          <rect x="6" y="19" width="2" height="2" fill="#dc2626" />
          <rect x="24" y="19" width="2" height="2" fill="#dc2626" />
          {/* Shorts */}
          <rect x="10" y="25" width="12" height="4" fill="#18181b" />
          <rect x="11" y="29" width="4" height="3" fill="#dc2626" />
          <rect x="17" y="29" width="4" height="3" fill="#dc2626" />
        </svg>
      );

    case 'rival_rotxapea':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rotxapea Rival Sprite (Green/White) */}
          <rect x="9" y="4" width="14" height="5" fill="#15803d" />
          <rect x="10" y="9" width="12" height="6" fill="#fcd34d" />
          <rect x="12" y="11" width="2" height="2" fill="#000" />
          <rect x="18" y="11" width="2" height="2" fill="#000" />
          {/* Green-White Striped Jersey */}
          <rect x="8" y="15" width="16" height="10" fill="#16a34a" />
          <rect x="11" y="15" width="3" height="10" fill="#ffffff" />
          <rect x="17" y="15" width="3" height="10" fill="#ffffff" />
          <rect x="10" y="25" width="12" height="7" fill="#15803d" />
        </svg>
      );

    case 'rival_burlades':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Burladés Rival (White/Blue) */}
          <rect x="9" y="4" width="14" height="5" fill="#1e40af" />
          <rect x="10" y="9" width="12" height="6" fill="#fed7aa" />
          <rect x="12" y="11" width="2" height="2" fill="#000" />
          <rect x="18" y="11" width="2" height="2" fill="#000" />
          <rect x="8" y="15" width="16" height="10" fill="#f8fafc" />
          <rect x="8" y="15" width="4" height="10" fill="#2563eb" />
          <rect x="20" y="15" width="4" height="10" fill="#2563eb" />
          <rect x="10" y="25" width="12" height="7" fill="#1e3a8a" />
        </svg>
      );

    case 'rival_txantrea':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Txantrea Rival (Blue) */}
          <rect x="9" y="4" width="14" height="5" fill="#3b82f6" />
          <rect x="10" y="9" width="12" height="6" fill="#fde047" />
          <rect x="12" y="11" width="2" height="2" fill="#000" />
          <rect x="18" y="11" width="2" height="2" fill="#000" />
          <rect x="8" y="15" width="16" height="10" fill="#1d4ed8" />
          <rect x="10" y="25" width="12" height="7" fill="#f8fafc" />
        </svg>
      );

    case 'item_bufanda':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="6" y="10" width="20" height="6" fill="#dc2626" />
          <rect x="10" y="10" width="4" height="6" fill="#18181b" />
          <rect x="18" y="10" width="4" height="6" fill="#18181b" />
          {/* Tassels */}
          <rect x="4" y="12" width="2" height="10" fill="#dc2626" />
          <rect x="26" y="12" width="2" height="10" fill="#dc2626" />
          <rect x="22" y="16" width="6" height="12" fill="#dc2626" />
          <rect x="22" y="19" width="6" height="3" fill="#18181b" />
          <rect x="22" y="28" width="6" height="2" fill="#fff" />
        </svg>
      );

    case 'item_bocata':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bread baguette */}
          <rect x="6" y="12" width="20" height="4" fill="#d97706" rx="1" />
          {/* Chistorra sausage */}
          <rect x="4" y="16" width="24" height="3" fill="#b91c1c" />
          <rect x="7" y="17" width="2" height="1" fill="#7f1d1d" />
          <rect x="14" y="17" width="2" height="1" fill="#7f1d1d" />
          <rect x="21" y="17" width="2" height="1" fill="#7f1d1d" />
          {/* Bottom bread */}
          <rect x="6" y="19" width="20" height="4" fill="#b45309" />
          {/* Steam / Aroma */}
          <rect x="10" y="7" width="2" height="3" fill="#cbd5e1" />
          <rect x="15" y="5" width="2" height="4" fill="#cbd5e1" />
          <rect x="20" y="7" width="2" height="3" fill="#cbd5e1" />
        </svg>
      );

    case 'item_balon':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Retro Leather Football */}
          <circle cx="16" cy="16" r="12" fill="#f8fafc" stroke="#18181b" strokeWidth="2" />
          <polygon points="16,11 20,14 19,19 13,19 12,14" fill="#18181b" />
          <line x1="16" y1="11" x2="16" y2="4" stroke="#18181b" strokeWidth="2" />
          <line x1="20" y1="14" x2="27" y2="12" stroke="#18181b" strokeWidth="2" />
          <line x1="19" y1="19" x2="24" y2="25" stroke="#18181b" strokeWidth="2" />
          <line x1="13" y1="19" x2="8" y2="25" stroke="#18181b" strokeWidth="2" />
          <line x1="12" y1="14" x2="5" y2="12" stroke="#18181b" strokeWidth="2" />
        </svg>
      );

    case 'item_silbato':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="12" width="10" height="8" fill="#e2e8f0" />
          <circle cx="21" cy="16" r="6" fill="#cbd5e1" />
          <rect x="6" y="14" width="2" height="4" fill="#94a3b8" />
          <circle cx="21" cy="16" r="2" fill="#475569" />
          {/* Red Ribbon */}
          <path d="M4 14 Q2 8 8 6 Q14 4 20 6" stroke="#dc2626" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'item_reflex':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Spray can */}
          <rect x="11" y="11" width="10" height="16" fill="#f8fafc" />
          <rect x="11" y="15" width="10" height="7" fill="#dc2626" />
          <rect x="14" y="6" width="4" height="4" fill="#38bdf8" />
          <rect x="15" y="4" width="2" height="2" fill="#0284c7" />
          {/* Spray Cloud */}
          <rect x="6" y="4" width="3" height="3" fill="#38bdf8" opacity="0.8" />
          <rect x="4" y="2" width="2" height="2" fill="#bae6fd" />
          <rect x="8" y="2" width="2" height="2" fill="#bae6fd" />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`image-rendering-pixelated ${silClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="6" y="6" width="20" height="20" fill="#dc2626" />
          <rect x="10" y="10" width="12" height="12" fill="#18181b" />
          <rect x="13" y="13" width="6" height="6" fill="#fff" />
        </svg>
      );
  }
};

export const PixelBadge: React.FC<{
  color?: string;
  size?: number;
  earned?: boolean;
  name?: string;
  iconName?: string;
  className?: string;
}> = ({
  color = '#dc2626',
  size = 56,
  earned = true,
  iconName = 'shield',
  className = '',
}) => {
  if (!earned) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg ${className}`}
      >
        <span className="font-pixel text-[10px] text-zinc-600">🔒</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center group transform transition-transform duration-200 hover:scale-110 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
      >
        {/* Outer Gold/Metal Bezel */}
        <polygon
          points="20,2 36,10 36,30 20,38 4,30 4,10"
          fill="#f59e0b"
          stroke="#78350f"
          strokeWidth="2"
        />
        {/* Inner Gem Shape */}
        <polygon
          points="20,6 32,13 32,27 20,34 8,27 8,13"
          fill={color}
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        {/* Shiny Highlight */}
        <polygon points="20,8 30,14 26,14 18,9" fill="#ffffff" fillOpacity="0.6" />
        
        {/* Center Emblem Icon based on iconName */}
        {iconName === 'soto' && (
          <text x="20" y="24" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#fff" fontFamily="monospace">
            SI
          </text>
        )}
        {iconName === 'crown' && (
          <polygon points="14,23 26,23 26,17 23,20 20,15 17,20 14,17" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
        )}
        {iconName === 'ball' && (
          <circle cx="20" cy="20" r="5" fill="#f8fafc" stroke="#18181b" strokeWidth="1" />
        )}
        {iconName === 'fire' && (
          <polygon points="20,13 23,17 21,25 19,25 17,17" fill="#f97316" />
        )}
        {iconName === 'star' && (
          <polygon points="20,14 22,18 26,19 23,22 24,26 20,24 16,26 17,22 14,19 18,18" fill="#facc15" stroke="#92400e" strokeWidth="0.5" />
        )}
        {iconName === 'shield' && (
          <polygon points="16,16 24,16 24,21 20,25 16,21" fill="#fff" />
        )}
      </svg>
    </div>
  );
};
