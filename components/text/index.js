import styles from "@/styles/Text.module.css";
import { useTextLogic } from "./logic";
import { useRef } from "react";
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

function ChatInputSmileIcon() {
  return (
    <svg viewBox="0 0 30 30" className={styles.chatInputSmileIcon} aria-hidden="true">
      <circle
        cx="15"
        cy="15"
        r="10.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.54174"
      />
      <path
        d="M11.4 11.7h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.54174"
        strokeLinecap="round"
      />
      <path
        d="M18.6 11.7h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.54174"
        strokeLinecap="round"
      />
      <path
        d="M11.2 18c1.05 1.35 2.35 2.02 3.8 2.02 1.45 0 2.75-.67 3.8-2.02"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.54174"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.2 7.7v4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.54174"
        strokeLinecap="round"
      />
      <path
        d="M17.9 10h4.6"
        fill="none"
        stroke="currentColor"
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

function InputMirror({ text, candidates, selected, highlightMode = "gradient" }) {
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
    if (highlightMode === "bold") {
      return (
        <span key={idx} className={styles.initialDraftCandidate}>
          {p}
        </span>
      );
    }
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

  if (message.role === "user" && message.candidates?.length) {
    return (
      <HighlightText
        text={message.text}
        candidates={message.candidates}
        onPick={onPick}
        guide={guide}
        sourceMessageId={message.id}
      />
    );
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
    goNext
  } = useTextLogic();
  const nicknameRef = useRef(null);
  const composerRef = useRef(null);
  const initialComposerRef = useRef(null);
  const hasJoinSystemVisible = timeline
    .slice(0, revealedCount)
    .some((m) => m.type === "system" && String(m.text || "").includes("채팅에 참여했어요!"));

  return (
    <main className={styles.page}>
      {step === "nickname" ? (
        <div className={styles.textDesktopFrame}>
          <div className={styles.textDesktopCanvas}>
            <div className={styles.textDesktopUi}>
              <div className={styles.textDesktopBrand}>
                <div className={styles.desktopSmileIconWrap}>
                  <SmilePlusIcon />
                </div>
                <div className={styles.textDesktopHeading}>Generative Emoji</div>
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
              <div className={styles.textDesktopUi}>
                <div className={styles.textDesktopBrand}>
                  <div className={styles.desktopSmileIconWrap}>
                    <SmilePlusIcon />
                  </div>
                  <div className={styles.textDesktopHeading}>Generative Emoji</div>
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
                    return (
                      <div key={m.id} className={styles.introRow}>
                        <div className={styles.introAvatar}>
                          <img className={styles.introAvatarImg} src={AVATAR_2} alt="" />
                        </div>
                        <div className={styles.figImageCard}>
                          <div className={styles.figImageLabel}>{isSelected ? "선택된 이미지" : "생성 이미지"}</div>
                          {m.src ? (
                            <img
                              className={isSelected ? `${styles.figImage} ${styles.figImageSelected}` : styles.figImage}
                              src={m.src}
                              alt={isSelected ? "선택된 생성 이미지" : "생성 이미지"}
                            />
                          ) : (
                            <div
                              className={isSelected ? `${styles.figColorPreview} ${styles.figColorPreviewSelected}` : styles.figColorPreview}
                              style={{ background: m.color || "#D1D5DB" }}
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

                  const showSuggestionHint =
                    String(m.text || "").startsWith(`오 ${nickname || "00"}이 왔구나! 하이~`);

                  return (
                    <div key={m.id} className={styles.chatMessageBlock}>
                      <div className={styles.introRow}>
                        <div className={styles.introAvatar}>
                          {m.role === "user" ? (
                            <div className={styles.userAvatar} aria-hidden="true" />
                          ) : (
                            <img
                              className={styles.introAvatarImg}
                              src={m.speaker === "B" ? AVATAR_1 : AVATAR_2}
                              alt=""
                            />
                          )}
                        </div>
                        <div className={styles.chatBubbleGroup}>
                          {senderName ? <div className={styles.chatSenderName}>{senderName}</div> : null}
                          <div className={bubbleClass}>
                            <BubbleText message={m} onPick={selectCandidate} guide={m.id === guideMessageId} />
                          </div>
                        </div>
                      </div>
                      {showSuggestionHint ? (
                        <div className={styles.chatSuggestionHintWrap}>
                          <div className={styles.chatSuggestionHintCard}>
                            대화 속 감정이 포착되면 이모지 생성 제안이 나타나요!
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {!showComposer && hasJoinSystemVisible ? (
                <div className={styles.chatInitialComposer}>
                  <div
                    className={
                      input.trim()
                        ? `${styles.chatInitialInputWrap} ${styles.chatInitialInputWrapActive}`
                        : styles.chatInitialInputWrap
                    }
                    onMouseDown={(e) => {
                      e.preventDefault();
                      initialComposerRef.current?.focus();
                    }}
                  >
                    <div className={styles.chatInitialInputMirror} aria-hidden="true">
                      <InputMirror text={input} candidates={liveCandidates} selected={null} highlightMode="bold" />
                    </div>
                    <textarea
                      ref={initialComposerRef}
                      className={styles.chatInitialTextarea}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="|메시지 입력"
                      rows={1}
                      spellCheck={false}
                      aria-label="메시지 입력"
                    />
                  </div>
                  <button className={styles.chatInitialSmileBtn} type="button" aria-label="이모지 생성">
                    <ChatInputSmileIcon />
                  </button>
                  <button className={styles.chatInitialMicBtn} type="button" aria-label="음성 입력">
                    <MicIcon />
                  </button>
                </div>
              ) : null}

              {showComposer ? (
                <div className={styles.figComposer}>
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
                            completeDraftWithPreview(0);
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
                            completeDraftWithPreview(1);
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

