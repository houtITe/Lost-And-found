import { useMemo, useState } from "react";
import "./App.css";
import "./support.css";

const categories = [
  "ទាំងអស់",
  "ទូរស័ព្ទ",
  "កាបូប",
  "កាតសិស្ស",
  "សោ",
  "សម្ភារៈសិក្សា",
  "អេឡិចត្រូនិក",
  "ឯកសារ",
  "អាវ / មួក",
  "ផ្សេងៗ",
];
const locations = ["ទាំងអស់", "អគារ A", "បណ្ណាល័យ", "អាហារដ្ឋាន", "អគារ IT"];
const items = [
  {
    id: 1,
    title: "កាតសិស្ស RUPP",
    category: "កាតសិស្ស",
    type: "found",
    place: "អគារ A · ជាន់ទី ២",
    date: "ថ្ងៃនេះ",
    color: "blue",
    code: "ID",
    description: "បានរកឃើញកាតសិស្សមួយនៅជិតជណ្តើរ អគារ A។ សូមទាក់ទងដើម្បីផ្ទៀងផ្ទាត់។",
  },
  {
    id: 2,
    title: "កាបូបស្ពាយពណ៌ខ្មៅ",
    category: "កាបូប",
    type: "lost",
    place: "បណ្ណាល័យកណ្តាល",
    date: "ម្សិលមិញ",
    color: "orange",
    code: "BG",
    description: "បាត់កាបូបស្ពាយពណ៌ខ្មៅ នៅជិតកន្លែងអានសៀវភៅ។ មានសៀវភៅ និងកាបូបលុយនៅខាងក្នុង។",
  },
  {
    id: 3,
    title: "AirPods ពណ៌ស",
    category: "អេឡិចត្រូនិក",
    type: "found",
    place: "អគារ IT · បន្ទប់ ៣០៤",
    date: "២ ថ្ងៃមុន",
    color: "pink",
    code: "AP",
    description: "រកឃើញ AirPods ពណ៌សនៅក្នុងបន្ទប់ ៣០៤។ អ្នកជាម្ចាស់អាចទាក់ទងមកបាន។",
  },
  {
    id: 4,
    title: "កូនសោជាមួយ keychain",
    category: "សោ",
    type: "lost",
    place: "អាហារដ្ឋាន RUPP",
    date: "៣ ថ្ងៃមុន",
    color: "green",
    code: "KY",
    description: "បាត់កូនសោជាមួយ keychain ពណ៌ខៀវ នៅជុំវិញអាហារដ្ឋាន។",
  },
  {
    id: 5,
    title: "សៀវភៅ Calculus II",
    category: "សម្ភារៈសិក្សា",
    type: "found",
    place: "សួនខាងកើត",
    date: "៤ ថ្ងៃមុន",
    color: "purple",
    code: "BK",
    description: "បានរកឃើញសៀវភៅ Calculus II មួយក្បាលនៅលើកៅអីក្នុងសួនខាងកើត។",
  },
  {
    id: 6,
    title: "ទូរស័ព្ទ Samsung Galaxy",
    category: "ទូរស័ព្ទ",
    type: "lost",
    place: "ចំណតម៉ូតូខាងជើង",
    date: "៥ ថ្ងៃមុន",
    color: "teal",
    code: "PH",
    description: "បាត់ទូរស័ព្ទ Samsung Galaxy នៅចំណតម៉ូតូខាងជើង។ សូមជួយទាក់ទងមក ប្រសិនបើបានឃើញ។",
  },
];

const developerInfo = {
  telegramHandle: "@MhoutA1",
  telegramUrl: "https://t.me/MhoutA1",
  donationQrImage: "/aba-qr.png",
};
function Icon({ name }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <>
        <path d="M5 4h3l2 5-2 1c1 2 2 3 4 4l1-2 5 2v3c0 1-1 2-2 2C9 19 5 13 4 7c0-2 0-3 1-3Z" />
      </>
    ),
  };
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function OptionalImage({ src, alt, className, fallback }) {
  const [failed, setFailed] = useState(false);

  if (failed) return fallback;

  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />;
}

function HighResolutionMap() {
  const mapPdf = "https://www.rupp.edu.kh/assets/rupp_map.jpg";
  return (
    <section className="high-map">
      <div className="high-map-card">
        <div className="high-map-head">
          <div>
            <span className="kicker">HIGH-RESOLUTION CAMPUS MAP</span>
            <h2>ផែនទី RUPP សម្រាប់ zoom</h2>
            <p>Map នេះប្រើ official PDF ដើម្បីរក្សាលេខអគារ និងទីតាំងឲ្យច្បាស់ពេល zoom។</p>
          </div>
          <a href={mapPdf} target="_blank" rel="noreferrer">
            បើកពេញអេក្រង់ <Icon name="arrow" />
          </a>
        </div>
        <div className="pdf-viewer">
          <iframe src={mapPdf} title="Official RUPP campus map" />
        </div>
        <div className="pdf-tip">
          ប្រើ controls ក្នុង PDF viewer ដើម្បី zoom in / zoom out និងអូសមើលទីតាំងផ្សេងៗ
        </div>
      </div>
    </section>
  );
}

function ImageMapViewer() {
  const [zoom, setZoom] = useState(1);
  const imageUrl = "https://www.rupp.edu.kh/assets/rupp_map.jpg";
  return (
    <section className="image-map-section">
      <div className="image-map-card">
        <div className="high-map-head">
          <div>
            <span className="kicker">RUPP CAMPUS MAP</span>
            <h2>ផែនទី RUPP</h2>
            <p>ប្រើប៊ូតុង zoom ដើម្បីមើលផែនទី។ សម្រាប់ quality ខ្ពស់បំផុត សូមបើក official PDF។</p>
          </div>
          <a href="https://www.rupp.edu.kh/assets/rupp_map.jpg" target="_blank" rel="noreferrer">
            បើក official PDF <Icon name="arrow" />
          </a>
        </div>
        <div className="map-toolbar">
          <button onClick={() => setZoom((value) => Math.max(1, value - 0.25))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((value) => Math.min(3, value + 0.25))}>＋</button>
          <button onClick={() => setZoom(1)}>Reset</button>
        </div>
        <div className="image-map-viewport">
          <img
            src={imageUrl}
            alt="ផែនទីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
        <div className="map-hint">អូស scrollbar ខាងក្រោម ឬចំហៀង ដើម្បីមើលតំបន់ផ្សេងៗ</div>
      </div>
    </section>
  );
}

function App() {
  const [category, setCategory] = useState("ទាំងអស់");
  const [location, setLocation] = useState("ទាំងអស់");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [reportType, setReportType] = useState("found");
  const [reportedItems, setReportedItems] = useState(items);
  const [reportForm, setReportForm] = useState({
    title: "",
    keywords: "",
    category: "ផ្សេងៗ",
    contact: "",
    description: "",
    location: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentImagePreviews, setCommentImagePreviews] = useState([]);
  const [saved, setSaved] = useState([]);
  const [toast, setToast] = useState("");

  const filteredItems = useMemo(
    () =>
      reportedItems.filter((item) => {
        const term = search.toLowerCase();
        return (
          (category === "ទាំងអស់" || item.category === category) &&
          (location === "ទាំងអស់" || item.place.toLowerCase().includes(location.toLowerCase())) &&
          (type === "all" || item.type === type) &&
          (!term ||
            `${item.title} ${item.keywords || ""} ${item.description} ${item.place} ${item.category}`
              .toLowerCase()
              .includes(term))
        );
      }),
    [category, location, type, search, reportedItems],
  );

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const toggleSaved = (id) => {
    const isSaved = saved.includes(id);
    setSaved((current) => (isSaved ? current.filter((itemId) => itemId !== id) : [...current, id]));
    showToast(isSaved ? "បានដកចេញពីបញ្ជីរក្សាទុក" : "បានរក្សាទុករបស់នេះ");
  };

  const openReport = (kind) => {
    setReportType(kind);
    setReportForm({
      title: "",
      keywords: "",
      category: "ផ្សេងៗ",
      contact: "",
      description: "",
      location: "",
    });
    setImagePreviews([]);
    setReportOpen(true);
  };

  const updateReportField = (field, value) =>
    setReportForm((current) => ({ ...current, [field]: value }));

  const submitReport = () => {
    const title = reportForm.title.trim();
    if (!title) {
      showToast("សូមបញ្ចូលឈ្មោះរបស់ ដើម្បីឲ្យគេស្វែងរកបាន");
      return;
    }
    const code = title
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
    const newItem = {
      id: Date.now(),
      title,
      category: reportForm.category,
      type: reportType,
      place: reportForm.location.trim() || "មិនទាន់បញ្ជាក់",
      date: "ទើបតែបង្ហោះ",
      color: reportType === "found" ? "teal" : "orange",
      code: code || "NEW",
      description: reportForm.description.trim() || "មិនទាន់មានការពិពណ៌នា",
      keywords: reportForm.keywords.trim(),
      image: imagePreviews[0] || "",
      images: imagePreviews,
      comments: [],
    };
    setReportedItems((current) => [newItem, ...current]);
    setReportOpen(false);
    setReportForm({
      title: "",
      keywords: "",
      category: "ផ្សេងៗ",
      contact: "",
      description: "",
      location: "",
    });
    setImagePreviews([]);
    showToast("បានបង្ហោះព័ត៌មាន ហើយអាចស្វែងរកបាន");
  };

  const submitComment = () => {
    const text = commentText.trim();
    if ((!text && !commentImagePreviews.length) || !details) return;
    const comment = {
      id: Date.now(),
      name: "អ្នករកឃើញ",
      text,
      images: commentImagePreviews,
      date: "ទើបតែ",
    };
    setReportedItems((current) =>
      current.map((item) =>
        item.id === details.id ? { ...item, comments: [...(item.comments || []), comment] } : item,
      ),
    );
    setDetails((current) =>
      current ? { ...current, comments: [...(current.comments || []), comment] } : current,
    );
    setCommentText("");
    setCommentImagePreviews([]);
    showToast("បានបន្ថែម comment ទៅក្នុង post");
  };

  const handleHeroPointerMove = (event) => {
    const hero = event.currentTarget;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    hero.style.setProperty("--hero-x", `${x * 12}px`);
    hero.style.setProperty("--hero-y", `${y * 10}px`);
    hero.style.setProperty("--hero-glow-x", `${(x + 0.5) * 100}%`);
    hero.style.setProperty("--hero-glow-y", `${(y + 0.5) * 100}%`);
  };

  const resetHeroPointer = (event) => {
    event.currentTarget.style.setProperty("--hero-x", "0px");
    event.currentTarget.style.setProperty("--hero-y", "0px");
    event.currentTarget.style.setProperty("--hero-glow-x", "50%");
    event.currentTarget.style.setProperty("--hero-glow-y", "50%");
  };

  const handleCardPointerMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${x * 5}deg`);
    card.style.setProperty("--tilt-y", `${y * -5}deg`);
    card.style.setProperty("--spot-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--spot-y", `${(y + 0.5) * 100}%`);
  };

  const resetCardPointer = (event) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "50%");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="logo-box">
            <OptionalImage
              src="/rupp-logo.png"
              alt="RUPP logo"
              className="logo-image"
              fallback={<span className="asset-fallback logo-fallback">RUPP</span>}
            />
          </span>
          <span>
            <strong>RUPP</strong>
            <small>LOST & FOUND</small>
          </span>
        </a>
        <nav>
          <a className="active" href="#home">
            ទំព័រដើម
          </a>
          <a href="#items">ស្វែងរករបស់</a>
          <a href="#contact">ទាក់ទង</a>
        </nav>
        <div className="top-actions">
          <button
            className="saved-link"
            onClick={() => {
              setType("all");
              setSearch("");
              showToast(`${saved.length} របស់បានរក្សាទុក`);
            }}
          >
            <Icon name="heart" /> របស់ខ្ញុំ <span>{saved.length}</span>
          </button>
          <button className="report-small" onClick={() => openReport("found")}>
            <Icon name="plus" /> រាយការណ៍
          </button>
        </div>
      </header>

      <main id="home">
        <section
          className="hero"
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={resetHeroPointer}
        >
          <div className="hero-slideshow" aria-hidden="true">
            <div className="hero-track">
              <div className="hero-slide">
                <img src="https://www.old.rupp.edu.kh/img/slider1.jpg" alt="" />
              </div>
              <div className="hero-slide">
                <img
                  src="https://file.sunonglobal.com/wp-content/uploads/2025/04/1631869722621253zxf3.jpg"
                  alt=""
                />
              </div>
              <div className="hero-slide">
                <img
                  src="https://cjbar.rupp.edu.kh/public/journals/1/slider_image_jpg4tv8HG.jpg"
                  alt=""
                />
              </div>
              <div className="hero-slide">
                <img
                  src="https://cjbar.rupp.edu.kh/public/journals/1/slider_image_jpgUlhAQh.jpg"
                  alt=""
                />
              </div>
              <div className="hero-slide">
                <img
                  src="https://cjbar.rupp.edu.kh/public/journals/1/slider_image_jpgeYfwk0.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="hero-content">
            <span className="eyebrow">
              <b /> Lost And Found.
            </span>
            <h1>
              រកឃើញរបស់អ្នក
              <br />
              <em>បានកាន់តែងាយ</em>
            </h1>
            <p>បាត់អ្វីមួយ? ឬបានរកឃើញរបស់របស់អ្នកដទៃ? រាយការណ៍នៅទីនេះ</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => openReport("lost")}>
                ស្វែងរក
                <Icon name="arrow" />
              </button>
              <button className="secondary" onClick={() => openReport("found")}>
                ខ្ញុំបានរកឃើញរបស់
              </button>
            </div>
            <div className="hero-trust">
              <span>✓</span> ប្រើបានដោយសិស្ស និស្សិត និងបុគ្គលិក RUPP
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <button
            onClick={() => {
              setType("lost");
              document.querySelector("#items")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="action-icon orange">⌕</span>
            <span>
              <strong>ខ្ញុំកំពុងស្វែងរករបស់</strong>
              <small>រកមើលរបស់ដែលបានបាត់</small>
            </span>
            <Icon name="arrow" />
          </button>
          <button onClick={() => openReport("found")}>
            <span className="action-icon green">＋</span>
            <span>
              <strong>បានរកឃើញរបស់</strong>
              <small>ជួយប្រគល់ទៅម្ចាស់ដើម</small>
            </span>
            <Icon name="arrow" />
          </button>
          <button onClick={() => setSupportOpen(true)}>
            <span className="action-icon gold">♡</span>
            <span>
              <strong>ជួយគាំទ្រ project</strong>
              <small>ទាក់ទង ឬ donate ទៅ developer</small>
            </span>
            <Icon name="arrow" />
          </button>
        </section>

        <section className="items-section" id="items">
          <div className="section-head">
            <div>
              <span className="kicker">COMMUNITY BOARD</span>
              <h2>របស់ដែលបានរាយការណ៍ថ្មីៗ</h2>
              <p>ស្វែងរកតាមឈ្មោះរបស់ ពាក្យជំនួស ទីតាំង ឬប្រភេទ។</p>
            </div>
            <span className="result-count">{filteredItems.length} results</span>
          </div>
          <div className="search-box">
            <Icon name="search" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ឧ. សោម៉ូតូ, សំបុត្រម៉ូតូ, សម្ភារះសិក្សា..."
            />
            <button
              onClick={() => {
                setSearch("");
                setCategory("ទាំងអស់");
                setLocation("ទាំងអស់");
                setType("all");
              }}
            >
              សម្អាត
            </button>
          </div>
          <div className="filter-toolbar">
            <div className="filter-group">
              <span>ប្រភេទ៖</span>
              {categories.map((name) => (
                <button
                  className={category === name ? "selected" : ""}
                  onClick={() => setCategory(name)}
                  key={name}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="filter-group location-filter">
              <span>ទីតាំង៖</span>
              <div className="location-control">
                <input
                  className="location-input"
                  list="location-suggestions"
                  value={location === "ទាំងអស់" ? "" : location}
                  onChange={(e) => setLocation(e.target.value || "ទាំងអស់")}
                  placeholder="វាយ ឬជ្រើសទីតាំង"
                />
                <datalist id="location-suggestions">
                  {locations
                    .filter((name) => name !== "ទាំងអស់")
                    .map((name) => (
                      <option key={name} value={name} />
                    ))}
                </datalist>
                {location !== "ទាំងអស់" && (
                  <button
                    className="clear-location"
                    onClick={() => setLocation("ទាំងអស់")}
                    aria-label="សម្អាតទីតាំង"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <div className="type-tabs">
              <button className={type === "all" ? "active" : ""} onClick={() => setType("all")}>
                ទាំងអស់
              </button>
              <button className={type === "lost" ? "lost" : ""} onClick={() => setType("lost")}>
                របស់ដែលបាត់
              </button>
              <button className={type === "found" ? "active" : ""} onClick={() => setType("found")}>
                របស់ដែលត្រូវបានគេរកឃើញ
              </button>
            </div>
          </div>
          <div className="item-grid">
            {filteredItems.map((item) => (
              <article
                className="item-card"
                key={item.id}
                onClick={() => setDetails(item)}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={resetCardPointer}
              >
                <div className={`item-image ${item.color}`}>
                  {item.image ? (
                    <img className="item-photo" src={item.image} alt={item.title} />
                  ) : (
                    <span>{item.code}</span>
                  )}
                  <b className={item.type}>{item.type === "found" ? "រកឃើញ" : "បាត់"}</b>
                  <button
                    className={saved.includes(item.id) ? "saved" : ""}
                    aria-label="រក្សាទុក"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(item.id);
                    }}
                  >
                    <Icon name="heart" />
                  </button>
                </div>
                <div className="item-content">
                  <span className="item-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>
                    <Icon name="pin" /> {item.place}
                  </p>
                  <p>
                    <Icon name="clock" /> {item.date}
                  </p>
                  <button className="details-link">
                    មើលព័ត៌មានលម្អិត <Icon name="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="empty-state">
              <strong>⌕</strong>
              <h3>រកមិនឃើញទេ</h3>
              <p>សាកល្បងប្ដូរពាក្យស្វែងរក ឬតម្រងរបស់អ្នក។</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("ទាំងអស់");
                  setLocation("ទាំងអស់");
                  setType("all");
                }}
              >
                បង្ហាញទាំងអស់
              </button>
            </div>
          )}
        </section>
        <section className="map-panel" id="map">
          <div className="map-card">
            <header>
              <div>
                <span className="kicker">RUPP CAMPUS GUIDE</span>
                <h2>ផែនទីសាកលវិទ្យាល័យ RUPP</h2>
                <p>ប្រើផែនទីនេះ ដើម្បីស្គាល់ទីតាំង និងរាយការណ៍កន្លែងដែលអ្នកបានបាត់ ឬរកឃើញរបស់។</p>
              </div>
              <span className="map-label">LOCATION MAP</span>
            </header>
            <div className="map-view">
              <OptionalImage
                src="/rupp-map.png"
                alt="ផែនទីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ"
                className="map-image"
                fallback={
                  <div className="asset-fallback map-fallback">ផែនទីមិនទាន់ត្រូវបានបញ្ចូល</div>
                }
              />
            </div>
            <div className="map-hint">ចុច ឬ zoom ដើម្បីមើលព័ត៌មានលម្អិត</div>
          </div>
        </section>
        <HighResolutionMap />
        <ImageMapViewer />
      </main>

      <footer id="contact">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="logo-box">
              <OptionalImage
                src="/rupp-logo.png"
                alt="RUPP logo"
                className="logo-image"
                fallback={<span className="asset-fallback logo-fallback">RUPP</span>}
              />
            </span>
            <span>
              <strong>RUPP Lost & Found</strong>
              <small>Drop what you found. Find what you lost.</small>
            </span>
          </div>
          <div className="footer-links">
            <a href="#home">ទំព័រដើម</a>
            <a href="#items">ស្វែងរករបស់</a>
            <a href="https://t.me/rupp_lostandfound" target="_blank" rel="noreferrer">
              ចូលក្រុម Telegram
            </a>
          </div>
          <div className="footer-support">
            <strong>ចូលរួមជួយ project</strong>
            <p>គាំទ្រការអភិវឌ្ឍ platform សម្រាប់សហគមន៍ RUPP។</p>
            <button onClick={() => setSupportOpen(true)}>
              Contact / Donate <Icon name="arrow" />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 RUPP Lost & Found</span>
        </div>
      </footer>

      {reportOpen && (
        <div className="modal" onClick={() => setReportOpen(false)}>
          <div className="dialog report-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setReportOpen(false)}>
              ×
            </button>
            <span className="kicker">POST WITHOUT ACCOUNT</span>
            <h2>{reportType === "found" ? "របស់ដែលត្រូវបានគេរកឃើញ" : "របស់ដែលបាត់"}</h2>
            <p>បញ្ចូលឈ្មោះ និងពាក្យស្វែងរក ដើម្បីឲ្យម្ចាស់របស់អាចរកឃើញបានងាយ។</p>
            <div className="report-switch">
              <button
                className={reportType === "found" ? "active" : ""}
                onClick={() => setReportType("found")}
              >
                របស់ដែលត្រូវបានគេរកឃើញ
              </button>
              <button
                className={reportType === "lost" ? "active lost" : ""}
                onClick={() => setReportType("lost")}
              >
                របស់ដែលបាត់
              </button>
            </div>
            <label>
              ឈ្មោះរបស់{" "}
              <input
                value={reportForm.title}
                onChange={(e) => updateReportField("title", e.target.value)}
                placeholder="ឧ. Keyboard ពណ៌ខ្មៅ, អាវពណ៌ស"
              />
            </label>
            <label>
              ពាក្យស្វែងរកផ្សេងទៀត{" "}
              <input
                value={reportForm.keywords}
                onChange={(e) => updateReportField("keywords", e.target.value)}
                placeholder="ឧ. keyboard, អាវ, សំបុត្រម៉ូតូ"
              />
              <small className="field-hint">
                បញ្ចូលពាក្យជាភាសាខ្មែរ ឬអង់គ្លេសដែលម្ចាស់របស់អាចប្រើស្វែងរក។
              </small>
            </label>
            <label>
              ប្រភេទរបស់{" "}
              <select
                value={reportForm.category}
                onChange={(e) => updateReportField("category", e.target.value)}
              >
                {categories
                  .filter((name) => name !== "ទាំងអស់")
                  .map((name) => (
                    <option key={name}>{name}</option>
                  ))}
              </select>
            </label>
            <label>
              ទំនាក់ទំនង{" "}
              <input
                value={reportForm.contact}
                onChange={(e) => updateReportField("contact", e.target.value)}
                placeholder="ទូរស័ព្ទ ឬ Telegram"
              />
            </label>
            <label>
              ព័ត៌មានលម្អិត{" "}
              <textarea
                value={reportForm.description}
                onChange={(e) => updateReportField("description", e.target.value)}
                placeholder={
                  reportType === "found"
                    ? "ខ្ញុំបានរកឃើញវត្ថុនេះនៅ... ប្រសិនបើជារបស់អ្នក សូមទាក់ទងមកខ្ញុំ។"
                    : "ខ្ញុំបានបាត់... នៅ... ប្រសិនបើអ្នកឃើញ សូមទាក់ទងមកខ្ញុំ។"
                }
              />
            </label>
            <label>
              ទីតាំង និងពេលវេលា{" "}
              <input
                value={reportForm.location}
                onChange={(e) => updateReportField("location", e.target.value)}
                placeholder="ឧ. បណ្ណាល័យ នៅម៉ោង ៣ រសៀល"
              />
            </label>
            <label className="upload">
              {imagePreviews.length ? (
                <div className="upload-previews">
                  {imagePreviews.map((preview, index) => (
                    <img key={`${preview}-${index}`} src={preview} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              ) : (
                <span>
                  ＋
                  <small>
                    បញ្ចូលរូបភាពច្រើនសន្លឹក
                    <br />
                    JPG, PNG មិនលើស 4MB ក្នុងមួយរូប
                  </small>
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImagePreviews(
                    Array.from(e.target.files || []).map((file) => URL.createObjectURL(file)),
                  )
                }
              />
            </label>
            <button className="primary full" onClick={submitReport}>
              បញ្ជូនព័ត៌មាន <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}
      {supportOpen && (
        <div className="modal" onClick={() => setSupportOpen(false)}>
          <div className="dialog support-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSupportOpen(false)}>
              ×
            </button>
            <span className="kicker">DEVELOPER SUPPORT</span>
            <h2>ទាក់ទង developer / Donate</h2>
            <p>
              ព័ត៌មានខាងក្រោមនេះជារបស់ developer របស់ RUPP Lost & Found តែប៉ុណ្ណោះ។ អ្នកអាច scan QR
              code ដើម្បីគាំទ្រ project ឬទាក់ទងតាម Telegram។
            </p>
            <div className="developer-support-card">
              <div className="developer-qr">
                <OptionalImage
                  src={developerInfo.donationQrImage}
                  alt="ABA KHQR សម្រាប់ donate developer"
                  className="qr-image"
                  fallback={
                    <div className="asset-fallback qr-fallback">ABA QR មិនទាន់ត្រូវបានបញ្ចូល</div>
                  }
                />
                <span>ABA KHQR · Developer donation</span>
              </div>
              <div className="developer-info">
                <strong>ABA KHQR · Menghout Chhey</strong>
                <div className="developer-bank">
                  <span>KHR: 010 075 544</span>
                  <span>USD: 010 075 541</span>
                </div>
                <strong>Developer Telegram</strong>
                <a href={developerInfo.telegramUrl} target="_blank" rel="noreferrer">
                  {developerInfo.telegramHandle}
                </a>
                <p>
                  ទាក់ទងសម្រាប់ feedback, bug report, feature request ឬ donation សម្រាប់ការអភិវឌ្ឍ
                  website។
                </p>
                <a
                  className="primary full developer-chat"
                  href={developerInfo.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  បើក private chat <Icon name="arrow" />
                </a>
              </div>
            </div>
            <div className="donate-note">
              <strong>សំខាន់</strong>
              <span>
                QR code នេះសម្រាប់ developer និង project ប៉ុណ្ណោះ មិនមែនសម្រាប់អ្នករើសបានទេ។
              </span>
              <span>
                បើម្ចាស់របស់ចង់អរគុណ ឬ donate ទៅអ្នករើសបាន សូមនិយាយគ្នាផ្ទាល់ក្នុង private Telegram
                chat របស់ពួកគេ។ Website មិនទទួល ឬគ្រប់គ្រងការទូទាត់នោះទេ។
              </span>
            </div>
            <button className="support-close" onClick={() => setSupportOpen(false)}>
              បិទ
            </button>
          </div>
        </div>
      )}
      {details && (
        <div className="modal" onClick={() => setDetails(null)}>
          <div className="dialog detail-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setDetails(null)}>
              ×
            </button>
            <div className={`detail-image ${details.color}`}>
              {details.images?.[0] ? (
                <img className="detail-photo" src={details.images[0]} alt={details.title} />
              ) : (
                <span>{details.code}</span>
              )}
              <b className={details.type}>{details.type === "found" ? "រកឃើញ" : "បាត់"}</b>
            </div>
            {details.images?.length > 1 && (
              <div className="detail-gallery">
                {details.images.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${details.title} ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <span className="item-category">{details.category}</span>
            <h2>{details.title}</h2>
            <p className="detail-description">{details.description}</p>
            <p className="detail-meta">
              <Icon name="pin" /> {details.place}
            </p>
            <p className="detail-meta">
              <Icon name="clock" /> {details.date}
            </p>
            {details.type === "lost" ? (
              <section className="comment-section">
                <strong>បានឃើញរបស់នេះ?</strong>
                <p>អ្នករកឃើញអាច comment ជាមួយអត្ថបទ និងរូបភាព ដើម្បីជូនដំណឹងដល់ម្ចាស់របស់។</p>
                {details.comments?.map((comment) => (
                  <div className="comment-card" key={comment.id}>
                    <strong>{comment.name}</strong>
                    <small>{comment.date}</small>
                    <span>{comment.text}</span>
                    {comment.images?.length > 0 && (
                      <div className="comment-images">
                        {comment.images.map((image, index) => (
                          <img key={`${image}-${index}`} src={image} alt={`Comment ${index + 1}`} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="ឧ. ខ្ញុំបានឃើញវានៅអគារ A..."
                />
                <label className="comment-upload upload">
                  {commentImagePreviews.length ? (
                    <div className="upload-previews">
                      {commentImagePreviews.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={`Comment preview ${index + 1}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span>
                      ＋
                      <small>
                        បញ្ចូលរូបភាពបញ្ជាក់
                        <br />
                        អាចជ្រើសច្រើនសន្លឹក
                      </small>
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setCommentImagePreviews(
                        Array.from(e.target.files || []).map((file) => URL.createObjectURL(file)),
                      )
                    }
                  />
                </label>
                <button className="detail-contact" onClick={submitComment}>
                  ខ្ញុំបានរកឃើញរបស់នេះ <Icon name="arrow" />
                </button>
              </section>
            ) : (
              <>
                <p className="private-chat-note">
                  សម្រាប់ការទាក់ទង និងការអរគុណអ្នករើសបាន សូមប្រើ private Telegram chat
                  រវាងម្ចាស់របស់ និងអ្នករកឃើញផ្ទាល់។
                </p>
                <button
                  className="detail-contact"
                  onClick={() => {
                    setDetails(null);
                    showToast("សូមទាក់ទងតាម Telegram របស់អ្នករាយការណ៍");
                  }}
                >
                  <Icon name="phone" /> ទាក់ទងអ្នករាយការណ៍
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

export default App;
