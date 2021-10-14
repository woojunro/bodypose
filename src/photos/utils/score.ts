export const getConceptBookOrderScore = (
  studioPhotoAlias: string,
  studioAlias: string,
  seed: number,
) => {
  if (!Number.isInteger(seed)) {
    throw new Error('`seed` must be an integer.');
  }

  const fragments: string[] = [];

  // newer photos
  fragments.push(`log(4, ${studioPhotoAlias}.id)`);

  // division
  fragments.push(' / ');

  // a little more prob for studios with less photos (newer studios)
  fragments.push(`log(3, ${studioAlias}.photoCount)`);

  // scaling
  fragments.push(' / 100');

  // randomness
  fragments.push(` + rand(${seed})`);

  return fragments.join('');
};
