import type { ICoordinates } from '../types';

export default class AmchartsUtil {
  public static generateCoords(): ICoordinates {
    return {
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
    };
  }
}
