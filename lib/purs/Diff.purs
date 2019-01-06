module Diff where

import Prelude

import Data.Array (null, (:))
import Data.Array.Partial (head, tail)
import Data.Tuple (Tuple(..), fst)
import Partial.Unsafe (unsafePartial)

type Index = Int

head' :: forall t4. Array t4 -> t4
head' = unsafePartial head
tail' :: forall t2. Array t2 -> Array t2
tail' = unsafePartial tail

diff' :: Array String -> Array String -> Array (Tuple Boolean String) 
diff' = go []
  where
    go acc xs ys
      | null xs = acc
      | null ys = acc
      | (head' xs == head' ys) = go (acc <> pure (Tuple false (head' xs))) (tail' xs) (tail' ys)
      | otherwise = go (acc <> pure (Tuple true (head' ys))) xs (tail' ys)

diff :: Array String -> Array String -> Array Boolean
diff xs ys = fst <$> diff' xs ys