import {invoke} from "@tauri-apps/api";
import {memo, useCallback, useContext, useEffect, useRef, useState} from "react";
import {
  AreaHighlight,
  Content,
  IHighlight,
  NewHighlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  ScaledPosition,
  Tip,
  Highlight
} from "react-pdf-highlighter";
import "react-pdf-highlighter/dist/style.css";
import {percentToNumber, scaleDown, scaleUp} from "../utils/string-utils";
import {SelectedWordContext} from "../store/selected.ts";

function base64ToBlob(code: string) {
  code = code.replace(/[\n\r]/g, '');
  // atob() 方法用于解码使用 base-64 编码的字符串。
  const raw = window.atob(code);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {type: 'application/pdf'});
}

// TODO performances of pdf viewer is not good, need to optimize
const resetHash = () => {
}

const HighlightPopup = ({comment}: { comment: { text: string, emoji: string } }) =>
  comment.text ? (
    <div className={"Highlight__popup"}>
      {comment.emoji} {comment.text}
    </div>
  ) : null;


// initial value of highlights
const highlights: Array<IHighlight> = [];

const getNextId = () => String(Math.random()).slice(2);

const Pdf = memo(({url}: { url: string }) => {
  const pdfHighlighterRef = useRef<PdfHighlighter<IHighlight>>(null);

  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);

  const [scaledValue, setScaledValue] = useState<string>("100%");
  const [pdfScaledValue, setPdfScaledValue] = useState<string>("1");

  const [pdfUrl, setPdfUrl] = useState<string>('');

  const resetHighlights = () => {
    setHighlights([]);
  };

  const scrollViewerTo = useRef((highlight: IHighlight) => {
  });

  const scrollToHighlightFromHash = useCallback(() => {
  }, []);

  useEffect(() => {
    window.addEventListener("hashChange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash, false);
    }
  }, [scrollToHighlightFromHash]);

  useEffect(() => {
    setPdfScaledValue(percentToNumber(scaledValue));
  }, [scaledValue]);

  useEffect(() => {
    console.log(pdfScaledValue);
    pdfHighlighterRef.current?.handleScaleValue();
  }, [pdfScaledValue]);

  // save highlight locally
  useEffect(() => {
    // save
  }, [highlights]);

  const scaleUpThroughButton = () => {
    setScaledValue(scaleUp(scaledValue, 20));
  }

  const scaleDownThroughButton = () => {
    setScaledValue(scaleDown(scaledValue, 20));
  }

  useEffect(() => {
    // TODO the function `load_pdf_file` seems to be called twice
    invoke<string>('load_pdf_file', {filePath: url}).then((res: string) => {
      setPdfUrl(URL.createObjectURL(base64ToBlob(res)));
      console.log('pdf loaded');
    });
  }, [url]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    setHighlights((prevHighlights) => [
      {...highlight, id: getNextId()},
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
            position: {...originalPosition, ...position},
            content: {...originalContent, ...content},
            ...rest,
          }
          : h;
      }),
    );
  };

  const {setSelectedWord} = useContext(SelectedWordContext);

  return (
    <div className={"App flex size-full flex-col"}>
      <div className={"w-full h-10 z-10 bg-gray-100 flex justify-center items-center"}>
        <div id={"scroll-group"} className={"flex justify-center items-center h-[80%] gap-2"}>
          <button onClick={scaleUpThroughButton}><img src="/icons/plus.svg"/></button>
          <button onClick={scaleDownThroughButton}><img src="/icons/minus.svg"/></button>
          <select
            value={scaledValue}
            onChange={(e) => setScaledValue(e.target.value)}
            className={"h-full w-40 rounded-md bg-white border border-gray-300"}
          >
            <option value={"20%"}>20%</option>
            <option value={"40%"}>40%</option>
            <option value={"60%"}>60%</option>
            <option value={"80%"}>80%</option>
            <option value={"100%"}>100%</option>
            <option value={"120%"}>120%</option>
            <option value={"140%"}>140%</option>
            <option value={"160%"}>160%</option>
            <option value={"180%"}>180%</option>
            <option value={"200%"}>200%</option>
          </select>
        </div>
      </div>
      <div className={"h-full w-full relative"}>
        {pdfUrl === '' ? <div/> : (
          <PdfLoader url={pdfUrl} beforeLoad={<div/>}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                ref={pdfHighlighterRef}
                pdfScaleValue={pdfScaledValue}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                scrollRef={(scrollTo) => {
                  scrollViewerTo.current = scrollTo;
                  scrollToHighlightFromHash();
                }}
                onSelectionFinished={(position, content, hideTipAndSelection, transfromSelection) => {
                  if (content.text != null) {
                    setSelectedWord(content.text);
                  }
                  return (
                    <Tip
                      onOpen={transfromSelection}
                      onConfirm={(comment) => {
                        addHighlight({content, position, comment});
                        hideTipAndSelection();
                      }}
                    />
                  )
                }}
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
                          {boundingRect: viewportToScaled(boundingRect)},
                          {image: screenshot(boundingRect)},
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
});

Pdf.displayName = 'Pdf';
export default Pdf;