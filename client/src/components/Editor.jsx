import { useEffect, useRef, useState } from "react";
import EditorTab from "@monaco-editor/react";
import { ACTIONS } from "../action";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [editorCode, setEditorCode] = useState("");

    const languages = [
        "javascript",
        "csharp",
        "cpp",
        "java",
        "python",
        "ruby",
        "rust",
        "sql",
    ];

    const themes = ["vs-dark", "light"];
    const options = {
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: "on",
        accessibilitySupport: "auto",
        autoIndent: false,
        automaticLayout: true,
        codeLens: true,
        colorDecorators: true,
        contextmenu: true,
        cursorBlinking: "blink",
        cursorSmoothCaretAnimation: false,
        cursorStyle: "line",
        disableLayerHinting: false,
        disableMonospaceOptimizations: false,
        dragAndDrop: false,
        fixedOverflowWidgets: false,
        folding: true,
        foldingStrategy: "auto",
        fontLigatures: false,
        formatOnPaste: false,
        formatOnType: false,
        hideCursorInOverviewRuler: false,
        highlightActiveIndentGuide: true,
        links: true,
        mouseWheelZoom: false,
        multiCursorMergeOverlapping: true,
        multiCursorModifier: "alt",
        overviewRulerBorder: true,
        overviewRulerLanes: 2,
        quickSuggestions: true,
        quickSuggestionsDelay: 100,
        readOnly: false,
        renderControlCharacters: false,
        renderFinalNewline: true,
        renderIndentGuides: true,
        renderLineHighlight: "all",
        renderWhitespace: "none",
        revealHorizontalRightPadding: 30,
        roundedSelection: true,
        rulers: [],
        scrollBeyondLastColumn: 5,
        scrollBeyondLastLine: true,
        selectOnLineNumbers: true,
        selectionClipboard: true,
        selectionHighlight: true,
        showFoldingControls: "mouseover",
        smoothScrolling: false,
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: true,
        wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
        wordWrap: "off",
        wordWrapBreakAfterCharacters: "\t})]?|&,;",
        wordWrapBreakBeforeCharacters: "{([+",
        wordWrapBreakObtrusiveCharacters: ".",
        wordWrapColumn: 80,
        wordWrapMinified: true,
        wrappingIndent: "none",
    };

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    setEditorCode(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    const handleEditorChange = (value) => {
        onCodeChange(value);
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: value,
        });
    };

    return (
        <div className="bg-black sm:flex-1 h-full">
            <div className="h-[6%] flex justify-end px-2 ">
                <select
                    id="languages"
                    name="languages"
                    autoComplete="languages-name"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block text-white bg-gray-950 w-60  mx-2 px-3 rounded-md border-0 py-1 border-gray-900  shadow-sm ring-1 ring-inset ring-gray-900 focus:ring-2 focus:ring-inset  sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    {languages.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
                <select
                    id="themes"
                    name="themes"
                    autoComplete="themes-name"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="block text-white bg-gray-950 w-60  mx-2 px-3 rounded-md border-0 py-1 border-gray-900  shadow-sm ring-1 ring-inset ring-gray-900 focus:ring-2 focus:ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    {themes.map((them) => (
                        <option key={them} value={them}>
                            {them}
                        </option>
                    ))}
                </select>
            </div>

            <EditorTab
                theme={theme}
                width="100%"
                height="94%"
                language={language}
                defaultLanguage={language}
                defaultValue=""
                value={editorCode}
                onChange={handleEditorChange}
                options={options}
            />
        </div>
    );
};

export default Editor;
