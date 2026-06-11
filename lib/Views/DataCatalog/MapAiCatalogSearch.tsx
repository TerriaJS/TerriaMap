import { useEffect, useRef, useState } from "react";

import styled from "styled-components";
import { useViewState } from "terriajs-plugin-api";
import { ExplorerWindowComponents } from "terriajs/lib/ReactViews/ExplorerWindow/ExplorerWindowComponents";
import SearchBox from "terriajs/lib/ReactViews/Search/SearchBox";
import Box from "terriajs/lib/Styled/Box";
import Icon from "terriajs/lib/Styled/Icon";

const AI_SEARCH_EXAMPLES = [
  "Show me forestry data from 2010",
  "What data is available for Perth?",
  "Flood risk layers near Brisbane",
  "Imagery from the last 5 years",
  "2010 to 2015 ABS data"
];

function useTypewriterPlaceholder(active: boolean): string {
  const [placeholder, setPlaceholder] = useState("");
  const exampleIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!active) {
      setPlaceholder("");
      exampleIndex.current = 0;
      charIndex.current = 0;
      deleting.current = false;
      return;
    }

    function tick() {
      const current = AI_SEARCH_EXAMPLES[exampleIndex.current];

      if (!deleting.current) {
        charIndex.current += 1;
        setPlaceholder(current.slice(0, charIndex.current));
        if (charIndex.current === current.length) {
          // pause at end before deleting
          timer.current = setTimeout(() => {
            deleting.current = true;
            tick();
          }, 1800);
          return;
        }
      } else {
        charIndex.current -= 1;
        setPlaceholder(current.slice(0, charIndex.current));
        if (charIndex.current === 0) {
          deleting.current = false;
          exampleIndex.current =
            (exampleIndex.current + 1) % AI_SEARCH_EXAMPLES.length;
          // pause before typing next
          timer.current = setTimeout(tick, 400);
          return;
        }
      }

      timer.current = setTimeout(tick, deleting.current ? 25 : 50);
    }

    timer.current = setTimeout(tick, 300);
    return () => clearTimeout(timer.current);
  }, [active]);

  return placeholder;
}

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: ${(p) => p.theme.textDark};
  opacity: 0.5;
  cursor: help;
  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    top: 50%;
    left: calc(100% + 6px);
    transform: translateY(-50%);
    background: ${(p) => p.theme.dark};
    color: white;
    font-size: 10px;
    line-height: 1.4;
    padding: 4px 7px;
    border-radius: 4px;
    white-space: normal;
    width: 140px;
    pointer-events: none;
    z-index: 100;
  }
`;

const SearchBoxWrapper = styled.div<{ aiSearch: boolean }>`
  ${(p) =>
    p.aiSearch &&
    `
    input {
      outline: 2px solid ${p.theme.colorPrimary};
      outline-offset: -2px;
    }
  `}
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
  color: ${(p) => p.theme.textDark};
  user-select: none;
`;

const ToggleInput = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 28px;
  height: 16px;
  background: ${(p) => p.theme.greyLighter};
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  &:checked {
    background: ${(p) => p.theme.colorPrimary};
  }
  &::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: left 0.2s;
  }
  &:checked::after {
    left: 14px;
  }
`;

export const MapAiCatalogSearch = ({
  searchPlaceholder,
  searchText,
  onSearchTextChanged,
  onDoSearch
}: React.ComponentProps<typeof ExplorerWindowComponents.DataCatalogSearch>) => {
  const [useAiSearch, setUseAiSearch] = useState(false);
  const viewState = useViewState();
  const { searchState } = viewState;

  const aiPlaceholder = useTypewriterPlaceholder(useAiSearch);

  return (
    <Box column>
      <SearchBoxWrapper aiSearch={useAiSearch}>
        <SearchBox
          searchText={searchText}
          onSearchTextChanged={onSearchTextChanged}
          onDoSearch={onDoSearch}
          placeholder={useAiSearch ? aiPlaceholder : searchPlaceholder}
          //   iconGlyph={ searchState.useAiSearch ? Icon.GLYPHS.sparkle : undefined }
        />
      </SearchBoxWrapper>
      <Box
        fullWidth
        css={`
          padding: 2px 10px;
        `}
      >
        <ToggleLabel>
          <ToggleInput
            checked={useAiSearch}
            onChange={() => {
              setUseAiSearch((old) => !old);
              const provider = searchState.catalogSearchProvider as any;
              if ("useAiSearch" in provider) {
                provider.useAiSearch = !provider.useAiSearch;
              }
            }}
          />
          Conversational AI Search
          <TooltipWrapper data-tooltip="(experimental) Use natural language to find data.">
            <Icon glyph={Icon.GLYPHS.help} css="width: 12px; height: 12px;" />
          </TooltipWrapper>
        </ToggleLabel>
      </Box>
    </Box>
  );
};
