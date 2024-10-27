import { invoke } from "@tauri-apps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { AreaHighlight, Content, IHighlight, NewHighlight, PdfHighlighter, PdfLoader, Popup, ScaledPosition, Tip, Highlight } from "react-pdf-highlighter";
import "react-pdf-highlighter/dist/style.css";

function base64ToBlob(code: string) {
  code = code.replace(/[\n\r]/g, '');
  // atob() 方法用于解码使用 base-64 编码的字符串。
  const raw = window.atob(code);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: 'application/pdf' });
}

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
      {comment.emoji} {comment.text}
    </div>
  ) : null;


const highlights: Record<string, Array<IHighlight>> = {};

const getNextId = () => String(Math.random()).slice(2);

export default function Pdf({ url }: { url: string }) {

  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);

  const [pdfUrl, setPdfUrl] = useState<string>('');

  const resetHighlights = () => {
    setHighlights([]);
  };

  const scrollViewerTo = useRef((highlight: IHighlight) => { });

  const scrollToHighlightFromHash = useCallback(() => {
  }, []);

  useEffect(() => {
    window.addEventListener("hashChange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash, false);
    }
  }, [scrollToHighlightFromHash]);

  useEffect(() => {
    // TODO the function `load_pdf_file` seems to be called twice
    invoke<string>('load_pdf_file', { filePath: url }).then((res: string) => {
      setPdfUrl(URL.createObjectURL(base64ToBlob(res)));
      console.log('pdf loaded');
    });
  }, [url]);

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
    <div className={"App flex size-full"}>
      <div className={"h-full w-full relative"}>
        {pdfUrl === '' ? <div /> : (
          <PdfLoader url={pdfUrl} beforeLoad={<div />}>
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
        )}
      </div>
    </div>
  )
}