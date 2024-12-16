export const PIXELS_PER_METER = 10
export const PIXELS_PER_KILOMETER = PIXELS_PER_METER * 1000

export const KILOMETER_IN_METERS = 1000
export const AU_IN_METERS = 149597870700
export const AU_IN_KILOMETERS = AU_IN_METERS / 1000

export const EMOJI = {
  ALIEN: '👽',
  ALIEN_MONSTER: '👾',
  ASTRONAUT_MAN: '👨‍🚀',
  ASTRONAUT_WOMAN: '👩‍🚀',
  COMET: '☄️',
  CRESCENT_MOON: '🌙',
  CROSS_MARK: '❌',
  DIZZY_SYMBOL: '💫',
  EARTH_GLOBE_AMERICAS: '🌎',
  EARTH_GLOBE_ASIA_AUSTRALIA: '🌏',
  EARTH_GLOBE_EUROPE_AFRICA: '🌍',
  FIRST_QUARTER_MOON: '🌓',
  FIRST_QUARTER_MOON_FACE: '🌛',
  FLYING_SAUCER: '🛸',
  FULL_MOON: '🌕',
  GLOWING_STAR: '🌟',
  HOURGLASS_DONE: '⌛',
  HOURGLASS_NOT_DONE: '⏳',
  LAST_QUARTER_MOON: '🌗',
  LAST_QUARTER_MOON_FACE: '🌜',
  MILKY_WAY: '🌌',
  NEW_MOON: '🌑',
  NEW_MOON_FACE: '🌚',
  QUESTION_MARK: '❓',
  RINGED_PLANET: '🪐',
  ROBOT_FACE: '🤖',
  ROCK: '🪨',
  ROCKET: '🚀',
  SATELLITE: '🛰️',
  SHOOTING_STAR: '🌠',
  SPARKLES: '✨',
  STAR: '⭐',
  SUNRISE: '🌅',
  SUNRISE_OVER_MOUNTAINS: '🌄',
  SUN_WITH_FACE: '🌞',
  TELESCOPE: '🔭',
  VOLCANO: '🌋',
  WANING_CRESCENT_MOON: '🌘',
  WANING_GIBBOUS_MOON: '🌖',
  WAXING_CRESCENT_MOON: '🌒',
  WAXING_GIBBOUS_MOON: '🌔',
}

export const CELESTIAL_TYPES: Record<number, { name: string; emoji: string }> =
  {
    1: { name: 'star', emoji: EMOJI.STAR },
    2: { name: 'planet', emoji: EMOJI.RINGED_PLANET },
    3: { name: 'moon', emoji: EMOJI.CRESCENT_MOON },
    4: { name: 'belt', emoji: EMOJI.ROCK },
    5: { name: 'station', emoji: EMOJI.SATELLITE },
  }
