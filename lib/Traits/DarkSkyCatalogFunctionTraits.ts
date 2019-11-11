import CatalogMemberTraits from "terriajs/lib/Traits/CatalogMemberTraits";
import UrlTraits from "terriajs/lib/Traits/UrlTraits";
import mixTraits from "terriajs/lib/Traits/mixTraits";

export default class DarkSkyCatalogFunctionTraits extends mixTraits(
  UrlTraits,
  CatalogMemberTraits
) {}
