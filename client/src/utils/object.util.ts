export class ObjectUtils {
  static isObject(value: unknown): value is object {
    return value !== null && typeof value === 'object';
  }

  static hasOwnProperty<X extends object, Y extends PropertyKey>(
    obj: X,
    prop: Y
  ): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
  }
}