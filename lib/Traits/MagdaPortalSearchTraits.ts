import mixTraits from "terriajs/lib/Traits//mixTraits";
import CatalogGroupTraits from "terriajs/lib/Traits/CatalogGroupTraits";
import primitiveTrait from "terriajs/lib/Traits//primitiveTrait";

export default class MagdaPortalSearchTraits extends mixTraits(
  CatalogGroupTraits
) {
  @primitiveTrait({
    name: "Magda portal group ID",
    description: "The ID of the magda portal group.",
    type: "string"
  })
  id?: string;

  @primitiveTrait({
    name: "Magda portal URL",
    description: "The URL of the magda portal.",
    type: "string"
  })
  url?: string;
}
