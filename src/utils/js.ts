import { mergeWith } from 'lodash-es'

export function mergeWithoutNull<TObject, TSource>(
  object: TObject,
  source: TSource,
) {
  mergeWith(object, source, (objValue, srcValue) => {
    if (srcValue === null) {
      return objValue
    }
  })
}
