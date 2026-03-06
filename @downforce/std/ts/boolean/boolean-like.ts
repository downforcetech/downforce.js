export const BooleanLikeTrue  = [true,  1, 'true',  '1', 'yes', 'on'] as const
export const BooleanLikeFalse = [false, 0, 'false', '0', 'no',  'off'] as const
export const BooleanLike = [...BooleanLikeTrue, ...BooleanLikeFalse] as [...typeof BooleanLikeTrue, ...typeof BooleanLikeFalse]
