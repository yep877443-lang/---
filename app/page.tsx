"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent,
} from "react";

type ProjectCategory = "brand" | "poster" | "logo" | "other";

type Project = {
  number: string;
  title: string;
  english: string;
  meta: string;
  image: string;
  previewImage?: string;
  previewPosition?: string;
  previewFit?: "cover" | "contain";
  previewBackground?: string;
  compactPreview?: boolean;
  className: string;
  accent: string;
  mediaRatio?: string;
  gallery?: string[];
  fitInLightbox?: boolean;
  horizontalInLightbox?: boolean;
  description: string;
  deliverables: string[];
  tagType: "hangtag" | "price" | "care";
  rotation: number;
  shift: number;
  category: ProjectCategory;
};

const projectCategories: Array<{
  key: ProjectCategory;
  index: string;
  title: string;
  english: string;
  color: string;
  ink: string;
}> = [
  { key: "brand", index: "01", title: "品牌视觉", english: "BRAND VISUAL", color: "#cf2d6f", ink: "#fff8ed" },
  { key: "poster", index: "02", title: "海报设计", english: "POSTER DESIGN", color: "#3159e8", ink: "#ffffff" },
  { key: "logo", index: "03", title: "标志设计", english: "LOGO DESIGN", color: "#e8de3b", ink: "#171414" },
  { key: "other", index: "04", title: "其他设计", english: "OTHER DESIGN", color: "#c8c4bb", ink: "#171414" },
];

const looseAccessoryCopy: Record<ProjectCategory, string> = {
  brand: "BRAND SAMPLE",
  poster: "PRINT EDITION",
  logo: "MARK ARCHIVE",
  other: "MIXED MEDIA",
};

const projects: Project[] = [
  {
    number: "01",
    title: "八仙IP形象设计",
    english: "Eight Immortals IP Design",
    meta: "IP 形象 · 国潮插画 · 文创衍生",
    image: "/media/eight-immortals-long-v2-web.jpg",
    previewImage: "/media/eight-immortals-cover-v3.webp",
    previewFit: "contain",
    previewBackground: "#d43731",
    compactPreview: true,
    className: "project-card project-card--wide project-card--eight",
    accent: "#df332c",
    mediaRatio: "16 / 9",
    description: "以八仙文化为母题，建立兼具国潮气质与文创延展能力的角色系统。",
    deliverables: ["IP 角色", "插画系统", "文创延展"],
    tagType: "hangtag",
    rotation: -2.6,
    shift: 14,
    category: "other",
  },
  {
    number: "02",
    title: "SENSE JOURNEY系列海报设计",
    english: "Poster Experiment",
    meta: "AI 视觉 · 系列海报 · 艺术指导",
    image: "/media/sense-card.webp",
    previewImage: "/media/sense-wind-cover-v3.webp",
    previewFit: "contain",
    previewBackground: "#071426",
    className: "project-card project-card--tall",
    accent: "#20f2a5",
    gallery: [
      "/media/sense-series-wind-v2.jpg",
      "/media/sense-series-water-v2.jpg",
      "/media/sense-series-earth-v2.jpg",
      "/media/sense-series-light-v2.jpg",
    ],
    description: "用 AI 图像实验与大字排版记录自然中的风、光、水、土。",
    deliverables: ["艺术指导", "AI 视觉", "系列海报"],
    tagType: "price",
    rotation: 2.2,
    shift: -10,
    category: "poster",
  },
  {
    number: "03",
    title: "安澜枝-护肤品品牌形象设计",
    english: "Anabranch",
    meta: "品牌策略 · 高定护肤 · 视觉识别",
    image: "/media/anabranch-full.jpg",
    previewImage: "/media/anabranch-logo-preview-v4.webp",
    previewFit: "contain",
    previewBackground: "#ded9d5",
    className: "project-card project-card--full project-card--anabranch",
    accent: "#b7a185",
    mediaRatio: "2383 / 1375",
    fitInLightbox: true,
    description: "围绕修复与生长，构建克制、自然且具有高级感的护肤品牌视觉。",
    deliverables: ["品牌策略", "VI 识别", "应用设计"],
    tagType: "hangtag",
    rotation: -1.2,
    shift: 6,
    category: "brand",
  },
  {
    number: "04",
    title: "WIND BREW快闪店视觉企划",
    english: "Coffee × Outdoor",
    meta: "品牌概念 · 快闪视觉 · 应用系统",
    image: "/media/windbrew-long.webp",
    previewImage: "/media/windbrew-preview.webp",
    className: "project-card project-card--wide",
    accent: "#ffe117",
    mediaRatio: "1600 / 904",
    description: "将骑行的速度感与咖啡快闪体验结合，形成鲜明的城市生活方式品牌。",
    deliverables: ["品牌概念", "快闪视觉", "空间应用"],
    tagType: "price",
    rotation: 2.8,
    shift: 18,
    category: "brand",
  },
  {
    number: "05",
    title: "咪傲-宠物品牌包装设计",
    english: "Pet Care Packaging",
    meta: "标志设计 · 包装系统 · 商业视觉",
    image: "/media/mioa-packaging-full-v2.webp",
    previewImage: "/media/mioa-preview.webp",
    className: "project-card project-card--tall",
    accent: "#7540d7",
    mediaRatio: "2268 / 15736",
    description: "从友好陪伴出发，完成宠物食品品牌标志、包装与传播系统。",
    deliverables: ["标志设计", "包装系统", "商业视觉"],
    tagType: "hangtag",
    rotation: -3.1,
    shift: -4,
    category: "brand",
  },
  {
    number: "06",
    title: "上上签-东方养生品牌视觉",
    english: "Oriental Wellness Brand",
    meta: "品牌设计 · AI IP · 包装延展",
    image: "/media/shangshangqian-card.webp",
    previewImage: "/media/shangshangqian-logo-preview-v5.webp",
    previewFit: "contain",
    previewBackground: "#f7f2ea",
    compactPreview: true,
    className: "project-card project-card--wide",
    accent: "#315846",
    description: "以东方签文化与轻养生为线索，塑造年轻、轻盈的养生品牌形象。",
    deliverables: ["品牌设计", "AI IP", "包装延展"],
    tagType: "care",
    rotation: 1.3,
    shift: 8,
    category: "brand",
  },
  {
    number: "07",
    title: "序野-护肤品详情页",
    english: "Clean Skincare",
    meta: "电商详情 · 产品视觉 · 信息设计",
    image: "/media/xuye-long-v3.jpg",
    previewImage: "/media/xuye-preview-v2.png",
    className: "project-card project-card--tall",
    accent: "#c7d9c1",
    mediaRatio: "9 / 16",
    description: "用清透材质、留白与秩序化信息，完成洁面产品电商详情表达。",
    deliverables: ["电商详情", "产品视觉", "信息设计"],
    tagType: "care",
    rotation: -2,
    shift: 15,
    category: "other",
  },
  {
    number: "08",
    title: "夏日产品视觉海报",
    english: "Summer Product Campaign",
    meta: "商业海报 · 产品视觉 · 场景合成",
    image: "/media/product-poster-01.jpg",
    previewImage: "/media/summer-product-cover-v3.webp",
    previewFit: "contain",
    previewBackground: "#2698d3",
    className: "project-card project-card--full project-card--product-posters",
    accent: "#31a8ff",
    mediaRatio: "16 / 8.8",
    gallery: [
      "/media/product-poster-01.jpg",
      "/media/product-poster-02.jpg",
      "/media/product-poster-03.jpg",
      "/media/product-poster-04.jpg",
    ],
    description: "面向夏季消费场景完成四组产品合成海报，强化冷感、食欲与促销信息。",
    deliverables: ["商业海报", "场景合成", "产品视觉"],
    tagType: "price",
    rotation: 2.5,
    shift: -8,
    category: "poster",
  },
  {
    number: "15",
    title: "创维产品海报设计",
    english: "Skyworth Product Poster",
    meta: "产品海报 · 商业视觉 · 场景传播",
    image: "/media/skyworth-ktv-weekend-v1.webp",
    previewImage: "/media/skyworth-ktv-weekend-v1.webp",
    className: "project-card project-card--tall",
    accent: "#f06a28",
    mediaRatio: "1080 / 2079",
    gallery: [
      "/media/skyworth-ktv-weekend-v1.webp",
      "/media/skyworth-ktv-gift-v1.webp",
      "/media/skyworth-ktv-scenes-v1.webp",
    ],
    description: "围绕创维移动 KTV 的家庭娱乐与多场景使用体验，完成兼顾产品卖点、生活氛围与传播转化的系列海报。",
    deliverables: ["产品海报", "场景视觉", "系列传播"],
    tagType: "price",
    rotation: -1.6,
    shift: 10,
    category: "poster",
  },
  {
    number: "17",
    title: "沧州文物海报设计",
    english: "Cangzhou Heritage Posters",
    meta: "文化传播 · 文物主题 · 系列海报",
    image: "/media/cangzhou-heritage-dragon-pitcher-v1.jpg",
    previewImage: "/media/cangzhou-heritage-cover-v1.jpg",
    previewFit: "contain",
    previewBackground: "#e6e0d3",
    className: "project-card project-card--tall",
    accent: "#a51e20",
    mediaRatio: "2 / 3",
    gallery: [
      "/media/cangzhou-heritage-dragon-pitcher-v1.jpg",
      "/media/cangzhou-heritage-iron-lion-v1.jpg",
      "/media/cangzhou-heritage-gold-leopard-v1.jpg",
      "/media/cangzhou-heritage-floral-vase-v1.jpg",
    ],
    description: "以青釉龙柄壶、沧州铁狮子、错金豹镇与粉彩天球瓶为主题，通过器物细节、纸感肌理与留白排版，呈现沧州文物的历史质感。",
    deliverables: ["文物主题", "系列海报", "版式设计"],
    tagType: "price",
    rotation: 1.2,
    shift: 4,
    category: "poster",
  },
  {
    number: "09",
    title: "标志设计档案",
    english: "Logo Archive",
    meta: "标志设计 · 品牌符号 · 商业识别",
    image: "/media/logo-archive-marquee-v5.jpg",
    previewImage: "/media/logo-archive-marquee-v5.jpg",
    className: "project-card",
    accent: "#f2f2ee",
    mediaRatio: "11443 / 1278",
    fitInLightbox: true,
    horizontalInLightbox: true,
    description: "汇集不同品牌场景下的标志设计，呈现从概念提炼、视觉符号到商业识别应用的完整思考。",
    deliverables: ["品牌标志", "图形标志", "识别应用"],
    tagType: "care",
    rotation: -1.5,
    shift: 10,
    category: "logo",
  },
  {
    number: "10",
    title: "文字设计实验",
    english: "Typeface Design",
    meta: "字体设计 · 字形实验 · 视觉表达",
    image: "/media/typeface-full-v2.jpg",
    previewImage: "/media/typeface-cover-v2.png",
    previewFit: "contain",
    previewBackground: "#ffffff",
    compactPreview: true,
    className: "project-card",
    accent: "#ffffff",
    mediaRatio: "16 / 9",
    fitInLightbox: true,
    description: "围绕笔画、结构与情绪进行中文字体实验，探索文字本身的图像力量。",
    deliverables: ["字形设计", "标题字体", "版式实验"],
    tagType: "care",
    rotation: 2.1,
    shift: -14,
    category: "other",
  },
  {
    number: "11",
    title: "椒火记火锅鸡详情页",
    english: "Commercial E-commerce",
    meta: "电商详情 · 食品视觉 · 商业转化",
    image: "/media/hotpot-long-dark-web.jpg",
    previewImage: "/media/hotpot-card.webp",
    className: "project-card",
    accent: "#a63228",
    gallery: ["/media/hotpot-long-dark-web.jpg", "/media/hotpot-long-light-web.jpg"],
    description: "以浓郁食欲感和清晰卖点结构，完成深浅两套火锅鸡商品详情视觉。",
    deliverables: ["详情页", "食品合成", "卖点信息"],
    tagType: "price",
    rotation: -2.4,
    shift: 4,
    category: "other",
  },
  {
    number: "12",
    title: "扑通菜园品牌视觉",
    english: "Putong Garden",
    meta: "生鲜品牌 · 视觉识别 · 包装应用",
    image: "/media/putong-garden-brand-v1.jpg",
    previewImage: "/media/putong-garden-logo-preview-v3.webp",
    previewFit: "contain",
    previewBackground: "#ffffff",
    compactPreview: true,
    className: "project-card project-card--tall",
    accent: "#e94b30",
    mediaRatio: "1890 / 11693",
    description: "围绕每日新鲜配送场景，以亲切的蔬果角色和手写字形建立轻松、有温度的生鲜品牌。",
    deliverables: ["品牌标志", "蔬果 IP", "包装与传播"],
    tagType: "hangtag",
    rotation: 1.7,
    shift: -6,
    category: "brand",
  },
  {
    number: "13",
    title: "DONUTS KITTY品牌视觉",
    english: "Donuts Kitty",
    meta: "甜品品牌 · IP 形象 · 包装系统",
    image: "/media/donuts-kitty-brand-v1.jpg",
    previewImage: "/media/donuts-kitty-cover-v3.webp",
    previewFit: "contain",
    previewBackground: "#eb5f7a",
    className: "project-card project-card--tall",
    accent: "#eb5f7a",
    mediaRatio: "1890 / 8510",
    description: "以甜甜圈与猫咪的趣味组合构建轻快、年轻的甜品品牌，并延展到包装、门店与社交传播。",
    deliverables: ["品牌标志", "IP 插画", "包装与门店物料"],
    tagType: "price",
    rotation: -2.1,
    shift: 12,
    category: "brand",
  },
  {
    number: "14",
    title: "切克炸鸡品牌视觉",
    english: "CHIKI! Fried Chicken",
    meta: "餐饮品牌 · 视觉识别 · 空间应用",
    image: "/media/chiki-fried-chicken-brand-v1.jpg",
    previewImage: "/media/chiki-logo-preview-v3.webp",
    previewFit: "contain",
    previewBackground: "#ffffff",
    compactPreview: true,
    className: "project-card project-card--tall",
    accent: "#f04c16",
    mediaRatio: "1890 / 8650",
    description: "以高识别度的橙色、鸡形符号与棋盘纹样打造活力炸鸡品牌，覆盖包装、门店与推广物料。",
    deliverables: ["品牌标志", "VI 系统", "包装与空间应用"],
    tagType: "hangtag",
    rotation: 2.5,
    shift: -12,
    category: "brand",
  },
  {
    number: "16",
    title: "东方四美·穆夏风插画设计",
    english: "Oriental Beauties Illustration",
    meta: "AI 辅助设计 · 东方美学 · 系列插画",
    image: "/media/oriental-mucha-zhaojun-ai-v1.webp",
    previewImage: "/media/oriental-mucha-zhaojun-ai-v1.webp",
    className: "project-card project-card--tall",
    accent: "#9b4a37",
    mediaRatio: "3 / 4",
    gallery: [
      "/media/oriental-mucha-zhaojun-ai-v1.webp",
      "/media/oriental-mucha-xishi-ai-v1.webp",
      "/media/oriental-mucha-yuhuan-ai-v1.webp",
      "/media/oriental-mucha-diaochan-ai-v1.webp",
    ],
    description: "以 AI 辅助生成与人工审美筛选完成东方四美系列视觉，结合新艺术装饰构图、传统服饰与花卉意象进行风格探索。",
    deliverables: ["AI 辅助视觉", "系列插画", "风格探索"],
    tagType: "price",
    rotation: 1.8,
    shift: 8,
    category: "other",
  },
];

const strengths = [
  {
    index: "01",
    title: "品牌从 0 到 1",
    english: "Brand Systems",
    copy: "从命名语义、标志与色彩，到 IP、包装和落地物料，建立可持续扩展的统一视觉语言。",
    tags: ["品牌策略", "VI 系统", "包装设计"],
  },
  {
    index: "02",
    title: "AI 共创工作流",
    english: "AI Co-creation",
    copy: "把 ChatGPT、Gemini、即梦、可灵等工具放进真实设计流程，用于发想、风格探索、画面生成与效率提升。",
    tags: ["AIGC", "提示词", "图像优化"],
  },
  {
    index: "03",
    title: "多触点设计能力",
    english: "Across Touchpoints",
    copy: "覆盖品牌、展陈、导视、海报、手册、新媒体、电商与短视频，让概念在不同媒介保持一致。",
    tags: ["展陈物料", "商业海报", "电商视觉"],
  },
  {
    index: "04",
    title: "交付与协作意识",
    english: "Make It Happen",
    copy: "习惯从需求对接到定稿交付把控完整流程，能在多项目并行中兼顾风格、版式、工艺和节奏。",
    tags: ["项目推进", "高效沟通", "落地执行"],
  },
];

const experiences = [
  ["2025—2026", "沧州半城文化有限公司", "视觉设计师"],
  ["2023—NOW", "线上平台自主接单（副业）", "独立设计师"],
  ["2023—2025", "河北美术学院 · 视觉传达设计", "本科 / 专业前 1%"],
];

const receiptLinks = [
  ["01", "首页", "#home"],
  ["02", "关于我", "#profile"],
  ["03", "作品", "#work"],
  ["04", "能力", "#capability"],
  ["05", "经历", "#experience"],
  ["06", "联系", "#contact"],
];

function ReceiptNavigation({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={`receipt-nav${compact ? " receipt-nav--compact" : ""}`} aria-label="作品集目录">
      <div className="receipt-nav__brand"><span>HOW STUDIO</span><span>NO. 0826</span></div>
      <h2>PORTFOLIO<br />DIRECTORY</h2>
      <div className="receipt-nav__dash" />
      {receiptLinks.map(([number, label, href]) => (
        <a href={href} key={href}><span>{number}</span><strong>{label}</strong><i>↗</i></a>
      ))}
      <div className="receipt-nav__dash" />
      <Barcode />
    </nav>
  );
}

function Barcode() {
  return <span className="tag-barcode" aria-hidden="true" />;
}

function LooseAccessoryTags({ category, color, ink }: { category: ProjectCategory; color: string; ink: string }) {
  return (
    <div
      className="loose-accessories"
      style={{ "--loose-color": color, "--loose-ink": ink } as CSSProperties}
      aria-hidden="true"
    >
      <span className="loose-accessory loose-accessory--one">
        <b>{looseAccessoryCopy[category]}</b><small>H O W · AUTHENTIC</small><i />
      </span>
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <article
      className={`fashion-tag fashion-tag--${project.tagType}${project.compactPreview ? " fashion-tag--compact-preview" : ""}${flipped ? " is-flipped" : ""}`}
      style={{
        "--accent": project.accent,
        "--tag-rotation": `${project.rotation}deg`,
        "--tag-shift": `${project.shift}px`,
      } as CSSProperties}
    >
      <div className="fashion-tag__card">
        <div className="fashion-tag__inner">
          <button className="fashion-tag__face fashion-tag__front" type="button" onClick={onOpen}>
            <span className="fashion-tag__eyelet" aria-hidden="true" />
            <div className="fashion-tag__serial"><span>{project.number}</span><span>H O W / 2026</span></div>
            <div className="fashion-tag__image" style={project.previewBackground ? { background: project.previewBackground } : undefined}>
              <img
                src={project.previewImage ?? project.image}
                alt={`${project.title} 项目预览`}
                loading="lazy"
                style={(project.previewPosition || project.previewFit) ? {
                  objectPosition: project.previewPosition,
                  objectFit: project.previewFit,
                } : undefined}
              />
            </div>
            <div className="fashion-tag__title">
              <p>{project.meta}</p>
              <h3>{project.title}</h3>
              <span>{project.english}</span>
            </div>
            <div className="fashion-tag__retail">
              <Barcode />
              <strong>VIEW<br />DETAIL</strong>
            </div>
          </button>

          <button className="fashion-tag__face fashion-tag__back" type="button" onClick={onOpen}>
            <span className="fashion-tag__eyelet" aria-hidden="true" />
            <p className="fashion-tag__back-index">STYLE NO. {project.number}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul>
              {project.deliverables.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="fashion-tag__back-footer"><span>点击检视完整作品</span><span>↗</span></div>
          </button>
        </div>
      </div>
      <button
        className="fashion-tag__flip"
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-label={flipped ? `查看 ${project.title} 封面` : `查看 ${project.title} 说明`}
      >
        {flipped ? "正面" : "详情"}
      </button>
    </article>
  );
}

function LogoReceiptMarquee({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div className="logo-receipt" aria-label={`${project.title} 横向作品小票`}>
      <div className="logo-receipt__track">
        {[0, 1].map((copy) => (
          <button
            className="logo-receipt__sheet"
            type="button"
            onClick={onOpen}
            key={copy}
            tabIndex={copy === 1 ? -1 : 0}
            aria-hidden={copy === 1 ? true : undefined}
            aria-label={copy === 0 ? `查看 ${project.title} 完整作品` : undefined}
          >
            <span className="logo-receipt__intro">
              <small>STYLE NO. {project.number} / H O W 2026</small>
              <strong>{project.title}</strong>
              <em>{project.english}</em>
              <span>{project.meta}</span>
            </span>
            <span className="logo-receipt__visual">
              <img src={project.previewImage ?? project.image} alt="" loading="lazy" />
            </span>
            <span className="logo-receipt__checkout">
              <small>VISUAL IDENTITY ARCHIVE</small>
              <strong>标志设计<br />商业识别档案</strong>
              <span>{project.description}</span>
              <Barcode />
              <em>VIEW FULL ARCHIVE ↗</em>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectScrollImage({ src, alt }: { src: string; alt: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef({ pointerId: -1, startY: 0, startScroll: 0 });
  const panRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({ size: 100, offset: 0, visible: false });

  const updateScrollMetrics = () => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return;

    const { clientHeight, scrollHeight, scrollTop } = scrollArea;
    const visible = scrollHeight > clientHeight + 2;
    const size = visible ? Math.max(7, Math.min(100, (clientHeight / scrollHeight) * 100)) : 100;
    const scrollRange = Math.max(1, scrollHeight - clientHeight);
    const offset = visible ? (scrollTop / scrollRange) * (100 - size) : 0;
    setScrollMetrics({ size, offset, visible });
  };

  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return;

    const resizeObserver = new ResizeObserver(updateScrollMetrics);
    resizeObserver.observe(scrollArea);
    if (scrollArea.firstElementChild) resizeObserver.observe(scrollArea.firstElementChild);
    const animationFrame = requestAnimationFrame(updateScrollMetrics);
    window.addEventListener("resize", updateScrollMetrics);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollMetrics);
    };
  }, [src]);

  const handleThumbPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startScroll: scrollArea.scrollTop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleThumbPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const scrollArea = scrollRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!scrollArea || !track || !thumb || dragRef.current.pointerId !== event.pointerId) return;

    const scrollRange = scrollArea.scrollHeight - scrollArea.clientHeight;
    const thumbTravel = track.clientHeight - thumb.clientHeight;
    if (thumbTravel <= 0) return;
    scrollArea.scrollTop = dragRef.current.startScroll
      + ((event.clientY - dragRef.current.startY) / thumbTravel) * scrollRange;
  };

  const handleThumbPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = -1;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollArea = scrollRef.current;
    const track = trackRef.current;
    if (!scrollArea || !track || event.target !== event.currentTarget) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    scrollArea.scrollTo({
      top: ratio * (scrollArea.scrollHeight - scrollArea.clientHeight),
      behavior: "smooth",
    });
  };

  const adjustZoom = (amount: number, focus?: { clientX: number; clientY: number }) => {
    setZoom((current) => {
      const next = Math.min(3.5, Math.max(1, Number((current + amount).toFixed(2))));
      const scrollArea = scrollRef.current;
      if (!scrollArea || next === current) return next;

      const rect = scrollArea.getBoundingClientRect();
      const focusX = focus
        ? Math.min(scrollArea.clientWidth, Math.max(0, focus.clientX - rect.left))
        : scrollArea.clientWidth / 2;
      const focusY = focus
        ? Math.min(scrollArea.clientHeight, Math.max(0, focus.clientY - rect.top))
        : scrollArea.clientHeight / 2;
      const contentX = scrollArea.scrollLeft + focusX;
      const contentY = scrollArea.scrollTop + focusY;
      const scaleRatio = next / current;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollArea.scrollLeft = contentX * scaleRatio - focusX;
          scrollArea.scrollTop = contentY * scaleRatio - focusY;
          updateScrollMetrics();
        });
      });

      return next;
    });
  };

  const handleZoomWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    event.stopPropagation();
    adjustZoom(event.deltaY < 0 ? 0.12 : -0.12, {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setIsDragging(false);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, left: 0 });
      updateScrollMetrics();
    });
  };

  const handlePanPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollArea = scrollRef.current;
    if (!scrollArea || zoom <= 1 || event.button !== 0) return;

    panRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: scrollArea.scrollLeft,
      startScrollTop: scrollArea.scrollTop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    event.preventDefault();
  };

  const handlePanPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollArea = scrollRef.current;
    const pan = panRef.current;
    if (!scrollArea || pan.pointerId !== event.pointerId) return;

    scrollArea.scrollLeft = pan.startScrollLeft - (event.clientX - pan.startX);
    scrollArea.scrollTop = pan.startScrollTop - (event.clientY - pan.startY);
    updateScrollMetrics();
    event.preventDefault();
  };

  const endPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (panRef.current.pointerId !== event.pointerId) return;
    panRef.current.pointerId = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  return (
    <div
      className="project-lightbox__image project-lightbox__image--scroll"
      onWheel={handleZoomWheel}
      onDoubleClick={resetZoom}
    >
      <div className="project-lightbox__zoom project-lightbox__zoom--detail" aria-label="作品缩放控制">
        <button type="button" onClick={() => adjustZoom(-0.2)} aria-label="缩小作品">−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => adjustZoom(0.2)} aria-label="放大作品">＋</button>
      </div>
      <p className="project-lightbox__zoom-hint">滚轮浏览 · Ctrl / ⌘ + 滚轮缩放 · 放大后拖动</p>
      <div
        className={`project-lightbox__scroll-content${zoom > 1 ? " is-zoomed" : ""}${isDragging ? " is-dragging" : ""}`}
        ref={scrollRef}
        onScroll={updateScrollMetrics}
        onPointerDown={handlePanPointerDown}
        onPointerMove={handlePanPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          onLoad={updateScrollMetrics}
          style={{ width: `${zoom * 100}%`, maxWidth: `${1400 * zoom}px` }}
        />
      </div>
      {scrollMetrics.visible && (
        <div
          className="project-lightbox__glass-scrollbar"
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          aria-hidden="true"
        >
          <button
            className="project-lightbox__glass-thumb"
            ref={thumbRef}
            type="button"
            tabIndex={-1}
            style={{ height: `${scrollMetrics.size}%`, top: `${scrollMetrics.offset}%` }}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
          />
        </div>
      )}
    </div>
  );
}

function ProjectDetailImage({ src, alt, onBack, horizontal = false }: { src: string; alt: string; onBack?: () => void; horizontal?: boolean }) {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [imageRatio, setImageRatio] = useState(1);
  const [detailViewport, setDetailViewport] = useState({ width: 1, height: 1 });
  const [horizontalMetrics, setHorizontalMetrics] = useState({ size: 100, offset: 0, visible: false });
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const horizontalThumbRef = useRef<HTMLButtonElement>(null);
  const horizontalDragRef = useRef({ pointerId: -1, startX: 0, startScroll: 0 });
  const detailPanRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
  });

  const adjustZoom = (amount: number, focus?: { clientX: number; clientY: number }) => {
    setZoom((current) => {
      const next = Math.min(3.5, Math.max(1, Number((current + amount).toFixed(2))));
      const scrollArea = detailScrollRef.current;

      if (!scrollArea || next === current) return next;

      const rect = scrollArea.getBoundingClientRect();
      const focusX = focus
        ? Math.min(scrollArea.clientWidth, Math.max(0, focus.clientX - rect.left))
        : scrollArea.clientWidth / 2;
      const focusY = focus
        ? Math.min(scrollArea.clientHeight, Math.max(0, focus.clientY - rect.top))
        : scrollArea.clientHeight / 2;
      const contentX = scrollArea.scrollLeft + focusX;
      const contentY = scrollArea.scrollTop + focusY;
      const scaleRatio = next / current;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollArea.scrollLeft = contentX * scaleRatio - focusX;
          scrollArea.scrollTop = contentY * scaleRatio - focusY;
        });
      });

      return next;
    });
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!horizontal && !event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    event.stopPropagation();
    adjustZoom(event.deltaY < 0 ? 0.12 : -0.12, {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setIsDragging(false);
    requestAnimationFrame(() => {
      detailScrollRef.current?.scrollTo({ top: 0, left: 0 });
    });
  };

  const handlePanPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollArea = detailScrollRef.current;
    if (!scrollArea || (!horizontal && zoom <= 1) || event.button !== 0) return;

    detailPanRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: scrollArea.scrollLeft,
      startScrollTop: scrollArea.scrollTop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    event.preventDefault();
  };

  const handlePanPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollArea = detailScrollRef.current;
    const pan = detailPanRef.current;
    if (!scrollArea || pan.pointerId !== event.pointerId) return;

    scrollArea.scrollLeft = pan.startScrollLeft - (event.clientX - pan.startX);
    scrollArea.scrollTop = pan.startScrollTop - (event.clientY - pan.startY);
    event.preventDefault();
  };

  const endPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (detailPanRef.current.pointerId !== event.pointerId) return;
    detailPanRef.current.pointerId = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const updateHorizontalMetrics = () => {
    const scrollArea = detailScrollRef.current;
    if (!scrollArea || !horizontal) return;
    const maxScroll = Math.max(0, scrollArea.scrollWidth - scrollArea.clientWidth);
    const size = scrollArea.scrollWidth > 0 ? Math.max(8, (scrollArea.clientWidth / scrollArea.scrollWidth) * 100) : 100;
    const offset = maxScroll > 0 ? (scrollArea.scrollLeft / maxScroll) * (100 - size) : 0;
    setHorizontalMetrics({ size, offset, visible: maxScroll > 2 });
  };

  useEffect(() => {
    const scrollArea = detailScrollRef.current;
    if (!scrollArea || !horizontal) return;
    const updateViewport = () => {
      setDetailViewport({ width: scrollArea.clientWidth, height: scrollArea.clientHeight });
      requestAnimationFrame(updateHorizontalMetrics);
    };
    updateViewport();
    const resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(scrollArea);
    return () => resizeObserver.disconnect();
  }, [horizontal]);

  useEffect(() => {
    if (!horizontal) return;
    requestAnimationFrame(updateHorizontalMetrics);
  }, [horizontal, zoom, imageRatio, detailViewport.width, detailViewport.height]);

  const handleHorizontalTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollArea = detailScrollRef.current;
    const track = horizontalTrackRef.current;
    if (!scrollArea || !track || event.target === horizontalThumbRef.current) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    scrollArea.scrollLeft = ratio * scrollArea.scrollWidth - scrollArea.clientWidth / 2;
    updateHorizontalMetrics();
  };

  const handleHorizontalThumbPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const scrollArea = detailScrollRef.current;
    if (!scrollArea) return;
    horizontalDragRef.current = { pointerId: event.pointerId, startX: event.clientX, startScroll: scrollArea.scrollLeft };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleHorizontalThumbPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const scrollArea = detailScrollRef.current;
    const track = horizontalTrackRef.current;
    const thumb = horizontalThumbRef.current;
    const drag = horizontalDragRef.current;
    if (!scrollArea || !track || !thumb || drag.pointerId !== event.pointerId) return;
    const availableTrack = Math.max(1, track.clientWidth - thumb.clientWidth);
    const maxScroll = Math.max(0, scrollArea.scrollWidth - scrollArea.clientWidth);
    scrollArea.scrollLeft = drag.startScroll + (event.clientX - drag.startX) * (maxScroll / availableTrack);
    updateHorizontalMetrics();
    event.preventDefault();
  };

  const endHorizontalThumbDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (horizontalDragRef.current.pointerId !== event.pointerId) return;
    horizontalDragRef.current.pointerId = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const horizontalCanvasWidth = Math.max(detailViewport.width, detailViewport.height * imageRatio) * zoom;
  const horizontalCanvasHeight = detailViewport.height * zoom;

  return (
    <div
      className={`project-lightbox__image project-lightbox__image--detail${horizontal ? " is-horizontal" : ""}`}
      onWheel={handleWheel}
      onDoubleClick={resetZoom}
    >
      {onBack && (
        <button className="project-lightbox__detail-back" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> 返回画廊
        </button>
      )}
      <div className={`project-lightbox__zoom project-lightbox__zoom--detail${onBack ? " has-back" : ""}`} aria-label="作品缩放控制">
        <button type="button" onClick={() => adjustZoom(-0.2)} aria-label="缩小作品">−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => adjustZoom(0.2)} aria-label="放大作品">＋</button>
      </div>
      <p className="project-lightbox__zoom-hint">{horizontal ? "左右拖动 · 滚轮缩放 · 双击复位" : "滚轮浏览 · Ctrl / ⌘ + 滚轮缩放 · 放大后拖动"}</p>
      <div
        className={`project-lightbox__detail-scroll${zoom > 1 ? " is-zoomed" : ""}${horizontal ? " is-horizontal" : ""}${isDragging ? " is-dragging" : ""}`}
        ref={detailScrollRef}
        onScroll={horizontal ? updateHorizontalMetrics : undefined}
        onPointerDown={handlePanPointerDown}
        onPointerMove={handlePanPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div
          className="project-lightbox__detail-canvas"
          style={(horizontal ? {
            "--detail-zoom": zoom,
            width: `${horizontalCanvasWidth}px`,
            height: `${horizontalCanvasHeight}px`,
          } : {
            "--detail-zoom": zoom,
            width: `${zoom * 100}%`,
            height: `${zoom * 100}%`,
          }) as CSSProperties}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={(event) => {
              const image = event.currentTarget;
              if (image.naturalHeight) setImageRatio(image.naturalWidth / image.naturalHeight);
              requestAnimationFrame(updateHorizontalMetrics);
            }}
          />
        </div>
      </div>
      {horizontal && horizontalMetrics.visible && (
        <div
          className="project-lightbox__horizontal-scrollbar"
          ref={horizontalTrackRef}
          onPointerDown={handleHorizontalTrackPointerDown}
        >
          <button
            className="project-lightbox__horizontal-thumb"
            ref={horizontalThumbRef}
            type="button"
            aria-label="左右拖动查看完整标志设计"
            style={{ width: `${horizontalMetrics.size}%`, left: `${horizontalMetrics.offset}%` }}
            onPointerDown={handleHorizontalThumbPointerDown}
            onPointerMove={handleHorizontalThumbPointerMove}
            onPointerUp={endHorizontalThumbDrag}
            onPointerCancel={endHorizontalThumbDrag}
          />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quickNavVisible, setQuickNavVisible] = useState(false);
  const [quickNavDocking, setQuickNavDocking] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);
  const activeImages = activeProject?.gallery ?? (activeProject ? [activeProject.image] : []);
  const activeImage = activeImages[activeImageIndex];
  const hasGallery = activeImages.length > 1;

  const copyEmailAddress = async () => {
    const email = "19137647609@163.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 2600);
  };

  useEffect(() => {
    if (!quickNavVisible) {
      setQuickNavDocking(true);
      return;
    }
    const timer = window.setTimeout(() => setQuickNavDocking(false), 1680);
    return () => window.clearTimeout(timer);
  }, [quickNavVisible]);

  const closeLightbox = () => {
    setActiveProject(null);
  };

  const selectGalleryImage = (index: number) => {
    setActiveImageIndex(index);
  };

  useEffect(() => {
    if (!activeProject) return;

    const imageCount = activeProject.gallery?.length ?? 1;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProject(null);
      }
      if (event.key === "ArrowLeft" && imageCount > 1) {
        setActiveImageIndex((index) => (index - 1 + imageCount) % imageCount);
      }
      if (event.key === "ArrowRight" && imageCount > 1) {
        setActiveImageIndex((index) => (index + 1) % imageCount);
      }
    };

    document.documentElement.classList.add("has-lightbox");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.documentElement.classList.remove("has-lightbox");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeProject]);

  useEffect(() => {
    let frame = 0;
    let current = 0;
    let target = 0;

    const smoothstep = (value: number) => value * value * (3 - 2 * value);
    const range = (value: number, start: number, end: number) =>
      smoothstep(Math.min(1, Math.max(0, (value - start) / (end - start))));

    const renderHero = () => {
      const hero = heroRef.current;
      if (!hero) {
        frame = 0;
        return;
      }

      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.0005) current = target;

      hero.style.setProperty("--hero-progress", current.toFixed(4));
      hero.style.setProperty("--handle-drop", range(current, 0.04, 0.34).toFixed(4));
      hero.style.setProperty("--bag-open", range(current, 0.32, 0.66).toFixed(4));
      const bagRelease = range(current, 0.58, 0.98);
      const paperFlight = smoothstep(bagRelease);
      const paperArc = Math.sin(paperFlight * Math.PI);
      const paperSettle = range(paperFlight, 0.78, 1);
      hero.style.setProperty("--bag-release", bagRelease.toFixed(4));
      hero.style.setProperty("--paper-flight", paperFlight.toFixed(4));
      hero.style.setProperty("--paper-arc", paperArc.toFixed(4));
      hero.style.setProperty("--paper-settle", paperSettle.toFixed(4));
      hero.style.setProperty("--receipt-handoff", range(current, 0.82, 0.94).toFixed(4));

      if (current !== target) {
        frame = window.requestAnimationFrame(renderHero);
      } else {
        frame = 0;
      }
    };

    const updateHero = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const max = Math.max(1, hero.offsetHeight - window.innerHeight);
      target = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / max));
      setQuickNavVisible(target > 0.9);
      if (!frame) frame = window.requestAnimationFrame(renderHero);
    };
    updateHero();
    window.addEventListener("scroll", updateHero, { passive: true });
    window.addEventListener("resize", updateHero);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHero);
      window.removeEventListener("resize", updateHero);
    };
  }, []);

  return (
    <main className="site-shell">
      <section className="bag-hero" id="home" ref={heroRef}>
        <div className="bag-hero__sticky">
          <header className="bag-hero__masthead">
            <a href="#home" aria-label="返回首页"><img src="/media/how-logo.png" alt="HOW" /></a>
            <p>YANG ZIHAO / VISUAL &amp; AI DESIGNER</p>
            <a href="#contact">CONTACT ↗</a>
          </header>
          <div className="shopping-bag" aria-hidden="true">
            <img
              className="shopping-bag__photo shopping-bag__photo--upright"
              src="/media/shopping-bag-hero-upright-v6-user.png"
              alt=""
            />
            <img
              className="shopping-bag__photo shopping-bag__photo--lowered"
              src="/media/shopping-bag-hero-open-v6-user.png"
              alt=""
            />
            <div className="shopping-bag__mouth">
              <span className="shopping-bag__lip" />
            </div>
            <div className="hero-receipt"><ReceiptNavigation /></div>
            <div className="hero-tags" aria-hidden="true">
              <i>SELECTED<br />WORK</i>
              <i>OPEN<br />ARCHIVE</i>
              <i><Barcode /></i>
              <i>CARE<br />LABEL</i>
              <i>¥ 0826</i>
              <i>AI /<br />VISUAL</i>
              <i>SIZE<br />ONE</i>
            </div>
            <img
              className="shopping-bag__foreground shopping-bag__foreground--upright"
              src="/media/shopping-bag-hero-upright-v6-user.png"
              alt=""
            />
            <img
              className="shopping-bag__foreground shopping-bag__foreground--lowered"
              src="/media/shopping-bag-hero-open-v6-user.png"
              alt=""
            />
            <div className="shopping-bag__body">
              <span className="shopping-bag__shine" />
              <span className="shopping-bag__seam" />
              <strong>PORTFOLIO</strong>
              <small>VISUAL / AI / BRAND DESIGN · 2026</small>
            </div>
          </div>
          <div className="bag-hero__caption"><span>SCROLL TO UNPACK</span><i /></div>
          <h1 className="visually-hidden">杨子豪个人作品集：视觉设计、AI 设计与品牌设计</h1>
        </div>
      </section>

      <div
        className={`quick-ticket${quickNavVisible ? " is-visible" : ""}${quickNavDocking ? " is-docking" : ""}`}
        tabIndex={quickNavVisible ? 0 : -1}
        aria-label="展开作品集快捷导航"
      >
        <ReceiptNavigation compact />
      </div>

      <section className="receipt-section" id="profile">
        <div className="section-shell">
          <article className="profile-receipt">
            <header><span>HOW STUDIO</span><span>PROFILE / 01</span></header>
            <p className="receipt-date">ORDER #H O W-2026&nbsp;&nbsp; DESIGN DEPARTMENT</p>
            <h2>让视觉不仅好看，<br />也能解决问题。</h2>
            <div className="profile-receipt__body">
              <div><p className="receipt-label">DESIGN APPROACH</p><strong>视觉设计师<br />AI 设计师<br />品牌设计师</strong></div>
              <p>我关注的不只是单张画面的完成度，更是一个视觉系统如何被理解、被记住、被使用。具备品牌、活动、展陈、商业宣传与电商设计经验，并将 AI 工具融入创意发想、方案探索和视觉生成。</p>
            </div>
            <div className="receipt-stats">
              <div><b>TOP 1%</b><span>专业排名</span></div><div><b>9年</b><span>学习经验</span></div><div><b>30+</b><span>完整案例</span></div><div><b>300+</b><span>视觉物料</span></div>
            </div>
            <div className="profile-receipt__contact"><a href="mailto:19137647609@163.com">19137647609@163.com</a><a href="tel:+8619137647609">+86 191 3764 7609</a></div>
            <Barcode />
            <footer>THANK YOU FOR LOOKING · NO REFUND ON GOOD IDEAS</footer>
          </article>
        </div>
      </section>

      <section className="tag-work" id="work">
        <div className="section-shell">
          <header className="tag-work__heading"><p>02 / GARMENT TAG ARCHIVE</p><h2>从购物袋里，<br />拆开我的作品。</h2><span>PROJECT ARCHIVE<br />2023—2026</span></header>
          <div className="work-categories">
            {projectCategories.map((category) => (
              <section className={`work-category work-category--${category.key}`} key={category.key} aria-labelledby={`work-category-${category.key}`}>
                <header className="work-category__header">
                  <div
                    className="work-category__tag"
                    style={{
                      "--category-color": category.color,
                      "--category-ink": category.ink,
                    } as CSSProperties}
                  >
                    <i aria-hidden="true" />
                    <small>DEPARTMENT / {category.index}</small>
                    <strong id={`work-category-${category.key}`}>{category.title}</strong>
                    <span>{category.english}</span>
                  </div>
                  <p><span>{category.index}</span> / CURATED SELECTION</p>
                </header>
                <LooseAccessoryTags category={category.key} color={category.color} ink={category.ink} />
                {category.key === "logo" ? (
                  projects.filter((project) => project.category === category.key).map((project) => (
                    <LogoReceiptMarquee project={project} key={project.number} onOpen={() => { setActiveImageIndex(0); setActiveProject(project); }} />
                  ))
                ) : (
                  <div className="tag-rack">
                    {projects.filter((project) => project.category === category.key).map((project) => (
                      <ProjectCard project={project} key={project.number} onOpen={() => { setActiveImageIndex(0); setActiveProject(project); }} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="care-section" id="capability">
        <div className="section-shell">
          <header className="care-section__heading"><p>03 / MATERIAL &amp; CARE</p><h2>能力不是口号，<br />是每次交付的成分表。</h2></header>
          <div className="care-grid">
            {strengths.map((strength) => (
              <article className="care-label" key={strength.index}>
                <div className="care-label__symbols"><span>◯</span><span>△</span><span>□</span><span>✦</span></div>
                <p>{strength.index} / {strength.english}</p><h3>{strength.title}</h3><p>{strength.copy}</p>
                <div>{strength.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Barcode />
              </article>
            ))}
          </div>
          <p className="care-tools">MATERIALS / PS · AI · ID · PR · CHATGPT · GEMINI · 即梦 · 可灵</p>
        </div>
      </section>

      <section className="timeline-section" id="experience">
        <div className="section-shell">
          <article className="timeline-receipt">
            <header><span>EXPERIENCE RECEIPT</span><span>04 / HISTORY</span></header>
            <h2>形成判断力的过程</h2>
            <div className="timeline-receipt__dash" />
            {experiences.map(([year, company, role], index) => (
              <div className="timeline-item" key={`${year}-${company}`}><span>{String(index + 1).padStart(2, "0")}</span><time>{year}</time><strong>{company}</strong><p>{role}</p></div>
            ))}
            <div className="timeline-receipt__dash" /><p className="timeline-total">TOTAL EXPERIENCE&nbsp;&nbsp;&nbsp;&nbsp;3+ YEARS</p><Barcode />
          </article>
        </div>
      </section>

      <section className="checkout" id="contact">
        <div className="checkout__bag" aria-hidden="true"><span>HOW</span></div>
        <article className="checkout-receipt">
          <p>05 / CHECKOUT</p><h2>LET&apos;S MAKE<br />SOMETHING<br /><em>VISIBLE.</em></h2>
          <div className="checkout-receipt__dash" /><p>如果你正在寻找一位兼具视觉判断、AI 探索力与落地意识的设计师，欢迎联系我。</p>
          <button type="button" onClick={copyEmailAddress} aria-live="polite"><span>{emailCopied ? "邮箱已复制，可粘贴发送" : "复制邮箱，开始联系"}</span><span>{emailCopied ? "✓" : "↗"}</span></button>
          <dl><div><dt>EMAIL</dt><dd>19137647609@163.com</dd></div><div><dt>PHONE</dt><dd>+86 191 3764 7609</dd></div><div><dt>BASE</dt><dd>京津冀</dd></div></dl>
          <Barcode /><footer>© 2026 YANG ZIHAO · THANK YOU</footer>
        </article>
      </section>

      {activeProject && (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-lightbox-title"
          onClick={closeLightbox}
        >
          <button
            className="project-lightbox__close"
            type="button"
            onClick={closeLightbox}
            aria-label="关闭大图"
            autoFocus
          >
            <span>关闭</span><i aria-hidden="true">×</i>
          </button>
          <div className="project-lightbox__stage" onClick={(event) => event.stopPropagation()}>
            {hasGallery ? (
              <ProjectDetailImage
                src={activeImage}
                alt={`${activeProject.title} 第 ${activeImageIndex + 1} 张完整海报`}
                key={activeImage}
              />
            ) : activeProject.fitInLightbox ? (
              <ProjectDetailImage
                src={activeImage}
                alt={`${activeProject.title} 完整作品图`}
                horizontal={activeProject.horizontalInLightbox}
                key={activeImage}
              />
            ) : (
              <ProjectScrollImage
                src={activeImage}
                alt={`${activeProject.title} 完整作品图`}
                key={activeImage}
              />
            )}
            <div className="project-lightbox__meta">
              <div>
                <span>{activeProject.number} / {hasGallery ? `${String(activeImageIndex + 1).padStart(2, "0")}—${String(activeImages.length).padStart(2, "0")}` : "FULL VIEW"}</span>
                <h2 id="project-lightbox-title">{activeProject.title}</h2>
              </div>
              {hasGallery ? (
                <div className="project-lightbox__pager" aria-label="选择海报">
                  {activeImages.map((image, index) => (
                    <button
                      type="button"
                      className={index === activeImageIndex ? "is-active" : ""}
                      onClick={() => selectGalleryImage(index)}
                      aria-label={`查看第 ${index + 1} 张完整作品图`}
                      aria-current={index === activeImageIndex ? "true" : undefined}
                      key={image}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              ) : (
                <p>{activeProject.meta}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
