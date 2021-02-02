import CatalogMemberReferenceTraits from "terriajs/lib/Traits/CatalogMemberReferenceTraits";
import mixTraits from "terriajs/lib/Traits//mixTraits";
// import CatalogMemberTraits from "terriajs/lib/Traits//CatalogMemberTraits";
import MappableTraits from "terriajs/lib/Traits//MappableTraits";
import primitiveTrait from "terriajs/lib/Traits//primitiveTrait";
import UrlTraits from "terriajs/lib/Traits//UrlTraits";

export default class MagdaItemTraits extends mixTraits(
  UrlTraits,
  MappableTraits,
  CatalogMemberReferenceTraits
) {
  @primitiveTrait({
    name: "Item ID",
    description: "The ID of the portal item.",
    type: "string"
  })
  itemId?: string;
}
