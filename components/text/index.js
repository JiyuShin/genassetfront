import styles from "@/styles/Text.module.css";
import { useTextLogic } from "./logic";
import { useEffect, useRef, useState } from "react";
import GradientText from "@/components/ui/GradientText";

const AVATAR_1 = "https://www.figma.com/api/mcp/asset/18dff48d-f38a-47be-a34a-04b06dd781d0";
const AVATAR_2 = "https://www.figma.com/api/mcp/asset/77875335-69e8-49ba-a511-c42c87bda56f";

function SmilePlusIcon() {
  return (
    <svg viewBox="0 0 36 36" className={styles.desktopIconSvg} aria-hidden="true">
      <circle cx="18" cy="18" r="13.5" fill="none" stroke="currentColor" strokeWidth="2.7" />
      <path
        d="M12.5 21.5c1.7 2 4 3 6.5 3s4.8-1 6.5-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
      <path
        d="M13.5 14.5h.01M22.5 14.5h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M28.5 7.5v7M25 11h7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.chatHeaderBackIcon} aria-hidden="true">
      <path
        d="M19 12H7M12 17L7 12L12 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 34 34" className={styles.chatMicIcon} aria-hidden="true">
      <path
        d="M17 4.8a4.1 4.1 0 0 1 4.1 4.1v7.9a4.1 4.1 0 1 1-8.2 0V8.9A4.1 4.1 0 0 1 17 4.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 16.9a7.6 7.6 0 0 0 15.2 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M17 24.5v5.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M13.1 29.6h7.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 34 34" className={styles.chatMicIcon} aria-hidden="true">
      <path d="M9.5 24.6 27 17 9.5 9.4l3.1 6.9L27 17l-14.4.7-3.1 6.9Z" fill="currentColor" />
    </svg>
  );
}

function ChatInputSmileIcon({ animated = false }) {
  return (
    <svg viewBox="0 0 30 30" className={styles.chatInputSmileIcon} aria-hidden="true">
      {animated ? (
        <defs>
          <linearGradient id="chat-input-smile-gradient" gradientUnits="userSpaceOnUse" x1="-8" y1="0" x2="38" y2="0">
            <stop offset="0%" stopColor="#5227FF" />
            <stop offset="50%" stopColor="#4CC9FF" />
            <stop offset="100%" stopColor="#B19EEF" />
            <animate
              attributeName="x1"
              values="-8;8;-8"
              dur="2.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="38;54;38"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      ) : null}
      <circle
        cx="15"
        cy="15"
        r="10.8"
        fill="none"
        stroke={animated ? "url(#chat-input-smile-gradient)" : "currentColor"}
        strokeWidth="2.54174"
      />
      <path d="M11.2 11.8h1.1" fill="none" stroke={animated ? "url(#chat-input-smile-gradient)" : "currentColor"} strokeWidth="2.54174" strokeLinecap="round" />
      <path d="M17.7 11.8h1.1" fill="none" stroke={animated ? "url(#chat-input-smile-gradient)" : "currentColor"} strokeWidth="2.54174" strokeLinecap="round" />
      <path
        d="M11.2 18c1.05 1.35 2.35 2.02 3.8 2.02 1.45 0 2.75-.67 3.8-2.02"
        fill="none"
        stroke={animated ? "url(#chat-input-smile-gradient)" : "currentColor"}
        strokeWidth="2.54174"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.2 7.7v4.6"
        fill="none"
        stroke={animated ? "url(#chat-input-smile-gradient)" : "currentColor"}
        strokeWidth="2.54174"
        strokeLinecap="round"
      />
      <path
        d="M17.9 10h4.6"
        fill="none"
        stroke={animated ? "url(#chat-input-smile-gradient)" : "currentColor"}
        strokeWidth="2.54174"
        strokeLinecap="round"
      />
    </svg>
  );
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSpace(str) {
  return String(str || "").replace(/\s+/g, " ").trim();
}

function candidateToPattern(candidate) {
  // 후보 내 공백은 원문에서의 공백/줄바꿈/다중공백과 매칭되도록 \s+ 로 변환
  const norm = normalizeSpace(candidate);
  const escaped = escapeRegExp(norm);
  return escaped.replace(/\\\s+/g, "\\s+");
}

function findCandidateAtCaret(text, candidates, caretIndex) {
  const value = String(text || "");
  const list = (candidates || []).filter(Boolean);
  const idx = Math.max(0, Math.min(Number(caretIndex || 0), value.length));
  if (!value || list.length === 0) return null;

  const sorted = list.slice().sort((a, b) => b.length - a.length);
  for (const c of sorted) {
    const pat = candidateToPattern(c);
    if (!pat) continue;
    const re = new RegExp(pat, "g");
    let m;
    // eslint-disable-next-line no-cond-assign
    while ((m = re.exec(value))) {
      const start = m.index;
      const end = start + String(m[0] || "").length;
      if (idx >= start && idx <= end) return c;
      if (re.lastIndex === m.index) re.lastIndex += 1;
    }
  }
  return null;
}

function HighlightText({ text, candidates, onPick, guide, sourceMessageId }) {
  const list = (candidates || []).filter(Boolean);
  if (!text || list.length === 0) return text;

  const normalizedMap = new Map(list.map((c) => [normalizeSpace(c), c]));

  const pattern = list
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(candidateToPattern)
    .join("|");

  if (!pattern) return text;
  const re = new RegExp(`(${pattern})`, "g");
  const parts = String(text).split(re);

  let guideUsed = false;
  return parts.map((p, idx) => {
    const key = normalizeSpace(p);
    const canonical = normalizedMap.get(key);
    const hit = Boolean(canonical);
    if (!hit) return <span key={idx}>{p}</span>;
    const isGuide = Boolean(!guideUsed && guide);
    if (isGuide) guideUsed = true;
    return (
      <button
        key={idx}
        type="button"
        className={isGuide ? `${styles.candidateBtn} ${styles.candidateBtnGuide}` : styles.candidateBtn}
        onClick={() => onPick(canonical, sourceMessageId)}
      >
        <GradientText
          inline
          className={styles.candidateGradient}
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          animationSpeed={6}
          pauseOnHover
        >
          {p}
        </GradientText>
      </button>
    );
  });
}

function InputMirror({ text, candidates, selected, highlightMode = "gradient", onPick }) {
  const value = String(text || "");
  const list = (candidates || []).filter(Boolean);
  if (!value) return <span className={styles.inputMirrorText}>{value}</span>;
  if (list.length === 0) return <span className={styles.inputMirrorText}>{value}</span>;

  const normalizedMap = new Map(list.map((c) => [normalizeSpace(c), c]));
  const pattern = list
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(candidateToPattern)
    .join("|");
  if (!pattern) return <span className={styles.inputMirrorText}>{value}</span>;

  const re = new RegExp(`(${pattern})`, "g");
  const parts = value.split(re);

  if (highlightMode === "bold") {
    const nodes = [];
    for (let idx = 0; idx < parts.length; idx += 1) {
      const part = parts[idx];
      const key = normalizeSpace(part);
      const canonical = normalizedMap.get(key);
      const hit = Boolean(canonical);

      if (!hit) {
        nodes.push(
          <span key={idx} className={styles.inputMirrorText}>
            {part}
          </span>
        );
        continue;
      }

      let combined = part;
      let lookahead = idx;
      let pickTerm = canonical;
      while (lookahead + 2 < parts.length) {
        const spacer = parts[lookahead + 1];
        const nextPart = parts[lookahead + 2];
        const nextKey = normalizeSpace(nextPart);
        const nextCanonical = normalizedMap.get(nextKey);
        if (!/^\s+$/.test(spacer || "") || !nextCanonical) break;
        combined += spacer + nextPart;
        lookahead += 2;
      }

      nodes.push(
        onPick ? (
          <button
            key={idx}
            type="button"
            className={styles.chatInitialHighlightBtn}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPick(pickTerm);
            }}
          >
            <span className={styles.initialDraftCandidate}>{combined}</span>
          </button>
        ) : (
          <span key={idx} className={styles.initialDraftCandidate}>
            {combined}
          </span>
        )
      );
      idx = lookahead;
    }
    return nodes;
  }

  return parts.map((p, idx) => {
    const key = normalizeSpace(p);
    const canonical = normalizedMap.get(key);
    const hit = Boolean(canonical);
    if (!hit) {
      return (
        <span key={idx} className={styles.inputMirrorText}>
          {p}
        </span>
      );
    }
    const isSelected = canonical === selected;
    return (
      <span key={idx} className={isSelected ? `${styles.draftCandidate} ${styles.draftCandidateSelected}` : styles.draftCandidate}>
        <GradientText
          inline
          className={styles.draftCandidateGradient}
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          animationSpeed={6}
          pauseOnHover
        >
          {p}
        </GradientText>
      </span>
    );
  });
}

function BubbleText({ message, onPick, guide }) {
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts.map((p, idx) => {
      const clean = String(p.text || "").replace(/\n[ \t]+/g, "\n");
      if (p.tone === "pinkGlow") {
        return (
          <GradientText
            key={idx}
            inline
            className={styles.inlineGradient}
            colors={["#FF9FFC", "#5227FF", "#B19EEF"]}
            animationSpeed={8}
            pauseOnHover
          >
            {clean}
          </GradientText>
        );
      }
      if (p.tone === "blueGlow") {
        return (
          <GradientText
            key={idx}
            inline
            className={styles.inlineGradient}
            colors={["#1F6998", "#4CC9FF", "#B19EEF"]}
            animationSpeed={8}
            pauseOnHover
          >
            {clean}
          </GradientText>
        );
      }
      return <span key={idx}>{clean}</span>;
    });
  }

  if (message.role === "user") {
    if (Array.isArray(message.candidates) && message.candidates.length > 0) {
      return (
        <span className={styles.userBubbleText}>
          <InputMirror text={message.text} candidates={message.candidates} selected={null} highlightMode="bold" />
        </span>
      );
    }
    return <span className={styles.userBubbleText}>{message.text}</span>;
  }

  return message.text;
}

export default function TextPage() {
  const {
    step,
    nickname,
    setNickname,
    joinChat,
    timeline,
    revealedCount,
    input,
    setInput,
    listRef,
    canSend,
    send,
    hasUserMessage,
    showComposer,
    selectCandidate,
    guideMessageId,
    draftSelectedTerm,
    setDraftSelectedTerm,
    liveCandidates,
    draftPreviewColors,
    draftPreviewImages,
    draftGenerateStatus,
    draftGenerateError,
    draftPreviewIndex,
    setDraftPreviewIndex,
    completeDraftWithPreview,
    startComposer,
    goNext
  } = useTextLogic();
  const nicknameRef = useRef(null);
  const composerRef = useRef(null);
  const initialComposerRef = useRef(null);
  const [initialComposerHeight, setInitialComposerHeight] = useState(47);
  const [suggestionHintDismissing, setSuggestionHintDismissing] = useState(false);
  const [suggestionHintHidden, setSuggestionHintHidden] = useState(false);
  const [actionHintVisible, setActionHintVisible] = useState(false);
  const [actionHintDismissing, setActionHintDismissing] = useState(false);
  const [actionHintHidden, setActionHintHidden] = useState(true);
  const hasJoinSystemVisible = timeline
    .slice(0, revealedCount)
    .some((m) => m.type === "system" && String(m.text || "").includes("채팅에 참여했어요!"));
  const handleOpenGenEmoji = () => {
    if (!input.trim() || liveCandidates.length === 0) return;
    startComposer();
    window.setTimeout(() => {
      composerRef.current?.focus();
    }, 0);
  };
  const handlePickLiveCandidate = (term) => {
    if (!input.trim() || liveCandidates.length === 0) return;
    dismissSuggestionHint();
    setActionHintDismissing(false);
    setActionHintHidden(true);
    setActionHintVisible(false);
    setDraftSelectedTerm(term);
    startComposer();
    window.setTimeout(() => {
      composerRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    const el = initialComposerRef.current;
    if (!el || showComposer || !hasJoinSystemVisible) return;
    el.style.height = "47px";
    const nextHeight = Math.max(47, Math.min(el.scrollHeight, 148));
    setInitialComposerHeight(nextHeight);
  }, [input, showComposer, hasJoinSystemVisible]);

  useEffect(() => {
    if (!suggestionHintDismissing) return undefined;
    const timer = window.setTimeout(() => {
      setSuggestionHintHidden(true);
    }, 380);
    return () => window.clearTimeout(timer);
  }, [suggestionHintDismissing]);

  useEffect(() => {
    if (!actionHintVisible || actionHintDismissing || actionHintHidden) return undefined;
    const timer = window.setTimeout(() => {
      setActionHintDismissing(true);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [actionHintVisible, actionHintDismissing, actionHintHidden]);

  useEffect(() => {
    if (!actionHintDismissing) return undefined;
    const timer = window.setTimeout(() => {
      setActionHintHidden(true);
      setActionHintVisible(false);
    }, 380);
    return () => window.clearTimeout(timer);
  }, [actionHintDismissing]);

  const dismissSuggestionHint = () => {
    if (suggestionHintHidden || suggestionHintDismissing) return;
    setSuggestionHintDismissing(false);
    setSuggestionHintHidden(true);
  };

  const showActionHint = () => {
    setActionHintVisible(true);
    setActionHintHidden(false);
    setActionHintDismissing(false);
  };

  return (
    <main className={styles.page}>
      {step === "nickname" ? (
        <div className={styles.textDesktopFrame}>
          <div className={styles.textDesktopDivider} aria-hidden="true" />
          <div className={styles.textDesktopCanvas}>
            <div className={`${styles.textDesktopUi} ${styles.textDesktopUiNicknameShift}`}>
              <div className={styles.textDesktopBrand}>
                <div className={styles.desktopSmileIconWrap}>
                  <SmilePlusIcon />
                </div>
                <div className={`${styles.textDesktopHeading} ${styles.textDesktopHeadingNicknameShift}`}>Generative Emoji</div>
              </div>

              <div className={styles.textDesktopNavHighlight} aria-hidden="true" />

              <div className={styles.desktopChatIconWrap}>
                <img className={styles.desktopChatImage} src="/chat.png" alt="" aria-hidden="true" />
              </div>

              <button
                className={styles.textDesktopChatButton}
                type="button"
                onClick={() => {
                  if (nickname.trim()) joinChat();
                }}
              >
                채팅하기
              </button>

              <div className={styles.desktopFolderIconWrap}>
                <img className={styles.desktopFolderImage} src="/fiile.png" alt="" aria-hidden="true" />
              </div>
            </div>

            <div className={styles.wireframeViewport}>
              <div className={styles.wireframePhone}>
                <div className={styles.wireframeVisual} aria-hidden="true">
                  <div className={styles.wireframeCircleOne} />
                  <div className={styles.wireframeCircleTwo} />
                  <div className={styles.wireframeCircleThree} />
                </div>

                <div className={styles.wireframeTitle}>Generative Emoji</div>
                <div className={styles.wireframeSubtitle}>AI와 대화하며 오늘의 감정을 이모지로 만들어보세요✨</div>

                <div
                  className={styles.wireframeInputWrap}
                  onClick={() => {
                    nicknameRef.current?.focus();
                  }}
                >
                  <input
                    className={styles.wireframeInput}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && nickname.trim()) joinChat();
                    }}
                    placeholder="대화에서 사용할 이름"
                    aria-label="닉네임"
                    ref={nicknameRef}
                  />
                </div>

                <button
                className={
                  nickname.trim()
                    ? `${styles.wireframeJoinBtn} ${styles.wireframeJoinBtnActive}`
                    : styles.wireframeJoinBtn
                }
                  type="button"
                  onClick={() => {
                    if (nickname.trim()) joinChat();
                  }}
                >
                  채팅방 들어가기
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : step === "join" ? (
        <div className={styles.joinWireframePhone}>
          <div className={styles.joinStatusBar} aria-hidden="true">
            <div className={styles.joinStatusTimeWrap}>
              <div className={styles.joinStatusTime}>9:41</div>
            </div>

            <div className={styles.joinStatusIcons}>
              <div className={styles.joinCellular}>
                <span className={styles.joinCellularBarOne} />
                <span className={styles.joinCellularBarTwo} />
                <span className={styles.joinCellularBarThree} />
                <span className={styles.joinCellularBarFour} />
              </div>

              <div className={styles.joinWifi}>
                <span className={styles.joinWifiArcOne} />
                <span className={styles.joinWifiArcTwo} />
                <span className={styles.joinWifiArcThree} />
              </div>

              <div className={styles.joinBattery}>
                <span className={styles.joinBatteryBorder} />
                <span className={styles.joinBatteryCap} />
                <span className={styles.joinBatteryCapacity} />
              </div>
            </div>

            <div className={styles.joinFloatingIsland} />
          </div>

          <div className={styles.onboardingCenter}>
            <div className={styles.avatarStack} aria-hidden="true">
              <div className={styles.avatarOne}>
                <img className={styles.avatarImg} src={AVATAR_1} alt="" />
              </div>
              <div className={styles.avatarTwo}>
                <img className={styles.avatarImg} src={AVATAR_2} alt="" />
              </div>
            </div>
            <button className={styles.joinBtn} type="button" onClick={joinChat}>
              채팅방 입장
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.chatStageBackground}>
          <div className={styles.chatStageDivider} aria-hidden="true" />
          <div className={styles.chatStageDesktopLayer} aria-hidden="true">
            <div className={styles.textDesktopCanvas}>
              <div className={`${styles.textDesktopUi} ${styles.textDesktopUiNicknameShift}`}>
                <div className={styles.textDesktopBrand}>
                  <div className={styles.desktopSmileIconWrap}>
                    <SmilePlusIcon />
                  </div>
                  <div className={`${styles.textDesktopHeading} ${styles.textDesktopHeadingNicknameShift}`}>Generative Emoji</div>
                </div>

                <div className={styles.textDesktopNavHighlight} />

                <div className={styles.desktopChatIconWrap}>
                  <img className={styles.desktopChatImage} src="/chat.png" alt="" />
                </div>

                <div className={styles.textDesktopChatButton}>채팅하기</div>

                <div className={styles.desktopFolderIconWrap}>
                  <img className={styles.desktopFolderImage} src="/fiile.png" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chatPhoneViewport}>
            <div className={styles.chatPhone}>
            <div className={styles.phoneHiddenImage} aria-hidden="true" />
            <img className={styles.chatStatusImage} src="/status.png" alt="" aria-hidden="true" />

              <div className={styles.chatPhoneInner}>
              <div className={styles.chatTopHeader}>
                <div className={styles.chatHeaderBack}>
                  <BackArrowIcon />
                </div>
                <div className={styles.chatHeaderCenter}>
                  <div className={styles.chatHeaderTitle}>Group chat</div>
                  <div className={styles.chatHeaderMembers}>Luna, Sol, {nickname || "Seung"}</div>
                </div>
              </div>

              <div ref={listRef} className={styles.chatStream} aria-label="채팅">
                {timeline.slice(0, revealedCount).map((m) => {
                  if (m.type === "system") {
                    return (
                      <div key={m.id} className={styles.chatSystem}>
                        {m.text}
                      </div>
                    );
                  }

                  if (m.type === "analysis") {
                    const a = m.analysis || {};
                    return (
                      <div key={m.id} className={styles.analysisRow}>
                        <div className={styles.analysisCard}>
                          <div className={styles.analysisLine}>1. 캐릭터: {a.character || "-"}</div>
                          <div className={styles.analysisLine}>
                            2. 행동 및 감정: {a.action || "-"} / {a.emotion || "-"}
                          </div>
                          <div className={styles.analysisLine}>3. 외형 묘사 및 특징: {a.appearance || "-"}</div>
                          <div className={styles.analysisLine}>
                            4. 소품 및 특수 소품: {(a.props && a.props.length ? a.props.join(", ") : "-")}
                          </div>
                          <div className={styles.analysisLine}>5. 이미지 저장 이름: {a.saveName || "-"}</div>
                          <div className={styles.analysisLine}>6. 이미지 생성 프롬프트: {a.imagePrompt || "-"}</div>
                          <div className={styles.analysisLine}>
                            7. 제목/표현어: {a.title || "-"} / {a.expressionWord || "-"}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (m.type === "image") {
                    return (
                      <div key={m.id} className={styles.introRow}>
                        <div className={styles.introAvatar}>
                          <img
                            className={styles.introAvatarImg}
                            src={m.speaker === "B" ? AVATAR_1 : AVATAR_2}
                            alt=""
                          />
                        </div>
                        <div className={styles.figImageCard}>
                          <div className={styles.figImageLabel}>{m.label || "예시"}</div>
                          <img className={styles.figImage} src={m.src} alt={m.label || ""} />
                          {m.reaction ? <div className={styles.figReaction}>{m.reaction}</div> : null}
                        </div>
                      </div>
                    );
                  }

                  if (m.type === "generatedImage") {
                    const isSelected = Number(m.index) === Number(m.selectedIndex);
                    if (!isSelected) return null;
                    return (
                      <div key={m.id} className={`${styles.introRow} ${styles.introRowUser} ${styles.generatedPreviewRow}`}>
                        <div className={`${styles.figImageCard} ${styles.figImageCardUser}`}>
                          <div className={styles.figImageLabel}>선택한 프리뷰</div>
                          {m.src ? (
                            <img
                              className={isSelected ? `${styles.figImage} ${styles.figImageSelected}` : styles.figImage}
                              src={m.src}
                              alt={isSelected ? "선택된 생성 이미지" : "생성 이미지"}
                            />
                          ) : (
                            <div
                              className={isSelected ? `${styles.figColorPreview} ${styles.figColorPreviewSelected}` : styles.figColorPreview}
                              style={{ background: "#B4C3FF" }}
                              aria-label={isSelected ? "선택된 생성 이미지" : "생성 이미지"}
                            />
                          )}
                        </div>
                      </div>
                    );
                  }

                  const bubbleClass =
                    m.variant === "userWhite"
                      ? styles.userBubble
                      : m.variant === "blue"
                      ? styles.figBubbleBlue
                      : m.variant === "yellowPink"
                        ? styles.figBubbleYellowPink
                        : styles.figBubbleYellow;
                  const senderName =
                    m.variant === "blue"
                      ? "Sol"
                      : m.variant === "userWhite"
                        ? ""
                        : "Luna";

                  const showSuggestionHint = String(m.text || "") === "넌 뭐했어?";
                  const isSingleLineIntroBubble =
                    String(m.text || "") === "B야 너 오늘 뭐했어? 심심해 죽겠다" ||
                    String(m.text || "") === "넌 뭐했어?";
                  const isManualBreakBubble =
                    String(m.text || "") === "하이~ 나 오늘 엄마 아빠랑 도쿄에\n유명한 불꽃축제 보고왔어. 완전 대박." ||
                    String(m.text || "") === `오 ${nickname || "00"}이 왔구나 하이~\nB는 오늘 도쿄에서 완전 재밌었대!` ||
                    (Array.isArray(m.parts) &&
                      String(m.parts?.[0]?.text || "") === "헐 나도 도쿄에 불꽃축제 너무 가고싶어 ㅠ" &&
                      String(m.parts?.[1]?.text || "") === "\n거기 유명한 녹차 당고도 먹었겠네?");
                  const rowClass = m.role === "user" ? `${styles.introRow} ${styles.introRowUser}` : styles.introRow;
                  const bubbleGroupClass =
                    m.role === "user" ? `${styles.chatBubbleGroup} ${styles.chatBubbleGroupUser}` : styles.chatBubbleGroup;

                  return (
                    <div key={m.id} className={styles.chatMessageBlock}>
                      <div className={rowClass}>
                        {m.role === "user" ? null : (
                          <div className={styles.introAvatar}>
                            <img
                              className={styles.introAvatarImg}
                              src={m.speaker === "B" ? AVATAR_1 : AVATAR_2}
                              alt=""
                            />
                          </div>
                        )}
                        <div className={bubbleGroupClass}>
                          {senderName ? <div className={styles.chatSenderName}>{senderName}</div> : null}
                          <div
                            className={
                              isSingleLineIntroBubble
                                ? `${bubbleClass} ${styles.figBubbleSingleLine}`
                                : isManualBreakBubble
                                  ? `${bubbleClass} ${styles.figBubbleManualBreak}`
                                  : bubbleClass
                            }
                          >
                            <BubbleText message={m} onPick={selectCandidate} guide={m.id === guideMessageId} />
                          </div>
                        </div>
                      </div>
                      {showSuggestionHint ? (
                        <>
                          {!suggestionHintHidden ? (
                            <div
                              className={
                                suggestionHintDismissing
                                  ? `${styles.chatSuggestionHintWrap} ${styles.chatSuggestionHintWrapDismissed}`
                                  : styles.chatSuggestionHintWrap
                              }
                            >
                              <div className={styles.chatSuggestionHintCard}>
                                대화 속 감정이 포착되면 이모지 생성 제안이 나타나요!
                              </div>
                            </div>
                          ) : null}
                          {actionHintVisible && !actionHintHidden ? (
                            <div
                              className={
                                actionHintDismissing
                                  ? `${styles.chatActionHintWrap} ${styles.chatActionHintWrapDismissed}`
                                  : styles.chatActionHintWrap
                              }
                            >
                              <div className={styles.chatActionHintCard}>
                                하이라이트를 클릭하여 이모지 생성을 시작해보세요!
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {hasJoinSystemVisible ? (
                <div className={styles.chatInitialComposer}>
                  <div
                    className={
                      input.trim()
                        ? `${styles.chatInitialInputWrap} ${styles.chatInitialInputWrapActive}`
                        : styles.chatInitialInputWrap
                    }
                    style={{ height: `${initialComposerHeight}px` }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      dismissSuggestionHint();
                      showActionHint();
                      initialComposerRef.current?.focus();
                    }}
                  >
                    <div className={styles.chatInitialInputMirror} aria-hidden="true">
                      <InputMirror
                        text={input}
                        candidates={liveCandidates}
                        selected={null}
                        highlightMode="bold"
                        onPick={handlePickLiveCandidate}
                      />
                    </div>
                    {!input.trim() ? <span className={styles.chatInitialPlaceholder}>메시지 입력</span> : null}
                    <textarea
                      ref={initialComposerRef}
                      className={styles.chatInitialTextarea}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => {
                        dismissSuggestionHint();
                        showActionHint();
                      }}
                      placeholder="메시지 입력"
                      rows={1}
                      spellCheck={false}
                      aria-label="메시지 입력"
                    />
                  </div>
                  <button
                    className={styles.chatInitialSmileBtn}
                    type="button"
                    aria-label="이모지 생성"
                    onClick={handleOpenGenEmoji}
                  >
                    <ChatInputSmileIcon animated={liveCandidates.length > 0} />
                  </button>
                  <button
                    className={styles.chatInitialMicBtn}
                    type="button"
                    aria-label={input.trim() ? "전송" : "음성 입력"}
                    onClick={() => {
                      if (!input.trim()) return;
                      send();
                    }}
                  >
                    {input.trim() ? <SendIcon /> : <MicIcon />}
                  </button>
                </div>
              ) : null}

              {showComposer ? (
                <div
                  className={styles.figComposer}
                  style={{
                    width: "338px",
                    ["--composer-seed-height"]: `${initialComposerHeight}px`
                  }}
                >
                  <div className={draftSelectedTerm ? `${styles.composerPill} ${styles.composerPillActive}` : styles.composerPill}>
                    {draftSelectedTerm ? "제이모지 생성 시작" : "제이모지 생성"}
                  </div>
                  {draftGenerateStatus === "loading" ? (
                    <div className={styles.comfyHint} aria-live="polite">
                      이미지 생성 중...
                    </div>
                  ) : null}
                  {draftGenerateStatus === "error" && draftGenerateError ? (
                    <div className={styles.comfyHintError} aria-live="polite">
                      {draftGenerateError}
                    </div>
                  ) : null}
                  <form
                    className={styles.figComposerInner}
                    onSubmit={(e) => {
                      e.preventDefault();
                      send();
                    }}
                  >
                    <div className={styles.inputWrap}>
                      <div className={styles.draftPreviewRow} aria-label="이미지 생성 프리뷰">
                        <button
                          type="button"
                          className={
                            draftPreviewIndex === 0
                              ? `${styles.draftPreviewBox} ${styles.draftPreviewSelected}`
                              : styles.draftPreviewBox
                          }
                          style={{ background: draftPreviewColors?.[0] || "#D1D5DB" }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setDraftPreviewIndex(0);
                          }}
                          aria-label="프리뷰 1 선택"
                        >
                          {draftPreviewImages?.[0] ? <img className={styles.draftPreviewImg} src={draftPreviewImages[0]} alt="" /> : null}
                          {draftGenerateStatus === "loading" ? <span className={styles.draftPreviewLoading} aria-hidden="true" /> : null}
                        </button>
                        <button
                          type="button"
                          className={
                            draftPreviewIndex === 1
                              ? `${styles.draftPreviewBox} ${styles.draftPreviewSelected}`
                              : styles.draftPreviewBox
                          }
                          style={{ background: draftPreviewColors?.[1] || "#E5E7EB" }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setDraftPreviewIndex(1);
                          }}
                          aria-label="프리뷰 2 선택"
                        >
                          {draftPreviewImages?.[1] ? <img className={styles.draftPreviewImg} src={draftPreviewImages[1]} alt="" /> : null}
                          {draftGenerateStatus === "loading" ? <span className={styles.draftPreviewLoading} aria-hidden="true" /> : null}
                        </button>
                      </div>
                      <div
                        className={styles.inputMirror}
                        onMouseDown={(e) => {
                          if (e.target.closest("button")) return;
                          e.preventDefault();
                          composerRef.current?.focus();
                        }}
                        aria-hidden="true"
                      >
                        <InputMirror
                          text={input}
                          candidates={liveCandidates}
                          selected={draftSelectedTerm}
                        />
                      </div>
                      <textarea
                        ref={composerRef}
                        className={styles.figTextarea}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onClick={(e) => {
                          const el = e.currentTarget;
                          const idx = el.selectionStart ?? 0;
                          const term = findCandidateAtCaret(el.value, liveCandidates, idx);
                          if (term) setDraftSelectedTerm(term);
                        }}
                        rows={2}
                        spellCheck={false}
                      />
                    </div>
                    <button className={styles.figSend} type="submit" disabled={!canSend} aria-label="전송">
                      ↗
                    </button>
                  </form>
                </div>
              ) : null}

                {showComposer && (hasUserMessage || canSend) ? (
                  <button className={styles.nextAfterSend} type="button" onClick={goNext}>
                    다음
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

