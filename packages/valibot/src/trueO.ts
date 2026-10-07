import * as v from 'valibot';

/**
 * Validates that the input is a "true" plain object.
 *
 * Rejects `null`, arrays, class instances and any non-literal object (only objects
 * whose prototype is `Object.prototype` or `null` are accepted).
 *
 * @example
 *   ```ts
 *   import * as v from 'valibot';
 *
 *   v.parse(trueO, {}); // ok
 *   v.parse(trueO, { a: 1 }); // ok
 *   v.parse(trueO, []); // throws
 *   v.parse(trueO, new Date()); // throws
 *   ```;
 *
 * @see {@linkcode v.objectWithRest}, {@linkcode v.any}, {@linkcode v.check}
 */
export const trueO = v.pipe(
  // 1. On part de la valeur brute pour ne rien laisser passer avant la vérification
  v.unknown(),

  // 2. On restreint pour n'autoriser QUE les objets littéraux ("plain objects")
  v.check(input => {
    // Exclut les primitives, null, les tableaux, et s'assure que le prototype est celui d'un objet de base
    if (typeof input !== 'object' || input === null || Array.isArray(input))
      return false;
    const proto = Object.getPrototypeOf(input);
    return proto === null || proto === Object.prototype;
  }, "L'élément doit être un objet littéral pur (pas de classe ni de tableau)."),

  // 3. On accepte enfin la structure globale d'un objet (vide ou avec rest)
  v.objectWithRest({}, v.any()),
);
