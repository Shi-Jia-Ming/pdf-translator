import { useCallback, useEffect, useRef, useState } from "react";
import { AreaHighlight, Content, IHighlight, NewHighlight, PdfHighlighter, PdfLoader, Popup, ScaledPosition, Tip, Highlight } from "react-pdf-highlighter";
import "react-pdf-highlighter/dist/style.css";

// TODO performances of pdf viewer is not good, need to optimize
const resetHash = () => {

}

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string, emoji: string }
}) =>
  comment.text ? (
    <div className={"Highlight__popup"}>
      { comment.emoji } { comment.text}
    </div>
  ) : null;


const highlights: Record<string, Array<IHighlight>> = {};

const getNextId = () => String(Math.random()).slice(2);

export default function Pdf() {
  const [url, setUrl] = useState("/micromodelicaspec1.pdf");
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);

  const resetHighlights = () => {
    setHighlights([]);
  };

  const scrollViewerTo = useRef((highlight: IHighlight) => {});

  const scrollToHighlightFromHash = useCallback(() => {
  }, []);

  useEffect(() => {
    window.addEventListener("hashChange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash, false);
    }
  }, [scrollToHighlightFromHash]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    setHighlights((prevHighlights) => [
      { ...highlight, id: getNextId() },
      ...prevHighlights,
    ])
  };

  const updateHighlight = (highlightId: string, position: Partial<ScaledPosition>, content: Partial<Content>) => {
    setHighlights((prevHighlights) => 
      prevHighlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
        ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest,
          }
        : h;
      }),
    );
  };

  return (
    <div className={"App flex h-full"}>
      <div className={"h-full w-full relative"}>
        <PdfLoader url={url} beforeLoad={<div/>}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              scrollRef={(scrollTo) => {
                scrollViewerTo.current = scrollTo;
                scrollToHighlightFromHash();
              }}
              onSelectionFinished={(position, content, hideTipAndSelection, transfromSelection) => (
                <Tip
                  onOpen={transfromSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment });
                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(
                highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo
              ) => {
                const isTextHighlight = !highlight.content?.image;

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) },
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
              highlights={highlights}
              />
          )}
        </PdfLoader>
      </div>
    </div>
  )
}