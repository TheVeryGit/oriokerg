/*
 * Панель «Просмотр» в админке: показывает карточку котёнка/кошки так, как её
 * увидят на сайте — в списке (квадрат со свайпом) и на странице (большое фото +
 * миниатюры). Фото берутся из загруженных в этой сессии файлов, поэтому видны
 * ещё ДО публикации. Зависит от photo-gallery-widget.js (window.OrioPhotos).
 */
(function () {
  "use strict";

  if (!window.CMS || typeof window.CMS.registerPreviewTemplate !== "function") return;

  var h = window.h;
  var createClass = window.createClass;
  var Photos = window.OrioPhotos || {
    toArray: function () { return []; },
    resolveUrl: function (p) { return p; },
    plural: function () { return ""; },
  };

  /* ─── Стили iframe с превью: тёмная тема сайта ─── */
  if (typeof window.CMS.registerPreviewStyle === "function") {
    window.CMS.registerPreviewStyle(
      "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap');" +
        "html,body{margin:0;background:#0c0b0d;}" +
        "body{font-family:Manrope,system-ui,sans-serif;color:#ece6da;line-height:1.6;}" +
        ".og-snap{scrollbar-width:none;-ms-overflow-style:none;}" +
        ".og-snap::-webkit-scrollbar{display:none;}",
      { raw: true }
    );
  }

  var C = {
    bg: "#0c0b0d",
    card: "#131215",
    border: "#28262a",
    borderStrong: "#3e3b3a",
    text: "#ece6da",
    muted: "#b7b0a4",
    gold: "#c9a14f",
    goldSoft: "#e7cf8b",
    goldText: "#20180a",
    green: "#c9a14f",
  };

  /* Квадратная карусель со свайпом — как PhotoCarousel на сайте. */
  var Carousel = createClass({
    getInitialState: function () {
      return { active: 0 };
    },
    onScroll: function (e) {
      var el = e.target;
      if (!el.clientWidth) return;
      var i = Math.round(el.scrollLeft / el.clientWidth);
      if (i !== this.state.active) this.setState({ active: i });
    },
    go: function (dir) {
      var el = this.track;
      if (!el) return;
      var next = Math.max(0, Math.min(this.props.urls.length - 1, this.state.active + dir));
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    render: function () {
      var self = this;
      var urls = this.props.urls;
      var active = Math.min(this.state.active, Math.max(urls.length - 1, 0));
      var multi = urls.length > 1;
      var arrow = function (side, dir, label) {
        var style = {
          position: "absolute", top: "50%", marginTop: "-18px", width: "36px", height: "36px",
          borderRadius: "50%", border: "1px solid rgba(255,255,255,.18)", background: "rgba(19,18,21,.7)",
          color: C.text, cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: 0, zIndex: 2,
        };
        style[side] = "10px";
        return h("button", { type: "button", style: style, "aria-label": label, onClick: function () { self.go(dir); } }, dir < 0 ? "‹" : "›");
      };

      return h("div", { style: { position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", background: C.card } },
        h("div", {
          className: "og-snap",
          ref: function (el) { self.track = el; },
          onScroll: this.onScroll,
          style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", overflowX: "auto", scrollSnapType: "x mandatory" },
        },
          urls.map(function (u, i) {
            return h("div", { key: i, style: { flex: "0 0 100%", height: "100%", scrollSnapAlign: "center" } },
              h("img", { src: u, alt: "", draggable: false, style: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" } }));
          })
        ),
        multi && active > 0 ? arrow("left", -1, "Назад") : null,
        multi && active < urls.length - 1 ? arrow("right", 1, "Вперёд") : null,
        multi ? h("div", { style: { position: "absolute", left: 0, right: 0, bottom: "12px", display: "flex", justifyContent: "center", gap: "6px", pointerEvents: "none" } },
          urls.map(function (u, i) {
            return h("span", { key: i, style: { height: "6px", width: i === active ? "20px" : "6px", borderRadius: "3px", background: i === active ? C.gold : "rgba(255,255,255,.6)" } });
          })
        ) : null
      );
    },
  });

  /* Страница животного: большое фото + миниатюры. */
  var PageGallery = createClass({
    getInitialState: function () {
      return { active: 0 };
    },
    render: function () {
      var self = this;
      var urls = this.props.urls;
      var active = Math.min(this.state.active, urls.length - 1);
      return h("div", {},
        h("div", { style: { position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", borderRadius: "8px", border: "1px solid " + C.border, background: C.card } },
          h("img", { src: urls[active], alt: "", style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" } }),
          urls.length > 1 ? h("span", { style: { position: "absolute", left: "10px", top: "10px", padding: "3px 11px", borderRadius: "999px", background: "rgba(19,18,21,.75)", fontSize: "12px" } }, (active + 1) + " / " + urls.length) : null
        ),
        urls.length > 1 ? h("div", { style: { display: "flex", gap: "8px", marginTop: "10px", overflowX: "auto" } },
          urls.map(function (u, i) {
            return h("button", {
              key: i, type: "button", onClick: function () { self.setState({ active: i }); },
              style: { flex: "0 0 calc((100% - 32px) / 5)", aspectRatio: "1 / 1", padding: 0, borderRadius: "6px", overflow: "hidden", cursor: "pointer", background: C.card,
                border: "2px solid " + (i === active ? C.gold : "transparent"), opacity: i === active ? 1 : 0.7 },
            }, h("img", { src: u, alt: "", style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }));
          })
        ) : null
      );
    },
  });

  function ageText(birth) {
    if (!birth) return "";
    var bd = new Date(birth);
    if (isNaN(bd.getTime())) return "";
    var days = Math.floor((Date.now() - bd.getTime()) / 86400000);
    if (days < 0) return "";
    var p = Photos.plural;
    if (days < 14) { var d = Math.max(days, 1); return d + " " + p(d, ["день", "дня", "дней"]); }
    if (days < 60) { var w = Math.round(days / 7); return w + " " + p(w, ["неделя", "недели", "недель"]); }
    var m = Math.floor(days / 30.44);
    return m + " " + p(m, ["месяц", "месяца", "месяцев"]);
  }

  function money(n) {
    return typeof n === "number" ? n.toLocaleString("ru-RU") + " ₽" : "";
  }

  var AnimalPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var getAsset = this.props.getAsset;
      var collection = this.props.collection && this.props.collection.get ? this.props.collection.get("name") : "kittens";
      var isKitten = collection !== "cats";
      var d = function (key) { return entry.getIn(["data", key]); };

      var name = d("name") || "Имя не указано";
      var gender = d("gender") || "";
      var color = d("color") || "";
      var description = d("description") || "";
      var birth = d("birth_date");
      var age = isKitten ? ageText(birth) : "";
      var price = isKitten ? d("price_pet") : d("price");
      var priceText = money(price) || (isKitten ? "Цена по запросу" : "");
      var reserved = isKitten ? d("reserved") : d("available") === false;
      var draft = d("draft");

      var urls = Photos.toArray(entry.getIn(["data", "photos"])).map(function (p) {
        return Photos.resolveUrl(p, getAsset);
      });

      var badgeText = isKitten ? (reserved ? "Зарезервирован" : "Свободен") : (gender === "Кот" ? "Производитель" : "Кошка");
      var badgeBg = isKitten ? (reserved ? "#131215" : C.gold) : "#131215";
      var badgeColor = isKitten && !reserved ? C.goldText : C.text;

      var label = { margin: "0 0 10px", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: C.muted };

      var cardImage = urls.length
        ? h(Carousel, { urls: urls })
        : h("div", { style: { position: "relative", width: "100%", paddingBottom: "100%", background: C.card } },
            h("div", { style: { position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", color: C.muted, fontSize: "14px" } },
              h("div", { style: { fontSize: "34px", opacity: 0.4 } }, "🐾"), "Фото ещё не добавлено"));

      var card = h("div", { style: { border: "1px solid " + C.border, borderRadius: "8px", background: C.card, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,.4)" } },
        h("div", { style: { position: "relative" } },
          cardImage,
          h("span", { style: { position: "absolute", right: "14px", top: "14px", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: badgeBg, color: badgeColor } }, badgeText)
        ),
        h("div", { style: { padding: "20px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" } },
            h("div", { style: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 } }, name),
            age ? h("span", { style: { flexShrink: 0, marginTop: "4px", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", background: "rgba(201,161,79,.12)", color: C.gold } }, "◷ " + age) : null
          ),
          (gender || color) ? h("div", { style: { marginTop: "4px", fontSize: "14px", color: C.muted } }, [gender, color].filter(Boolean).join(" · ")) : null,
          priceText ? h("div", { style: { marginTop: "14px", padding: "10px 16px", borderRadius: "999px", border: "1px solid " + C.border, display: "flex", justifyContent: "space-between", fontSize: "14px" } },
            h("span", { style: { color: C.muted } }, "Цена"),
            h("b", { style: { color: C.gold } }, priceText)) : null
        )
      );

      var facts = [];
      var addFact = function (k, v) { if (v) facts.push(h("div", { key: k }, h("span", { style: { color: C.muted } }, k + ": "), v)); };
      addFact("Дата рождения", birth ? new Date(birth).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "");
      addFact("Мама", d("mother"));
      addFact("Папа", d("father"));
      addFact("Тип", d("body_type"));
      if (isKitten && d("price_breed")) addFact("Цена в разведение (на сайте не показывается)", money(d("price_breed")));

      return h("div", { style: { padding: "24px", maxWidth: "980px", margin: "0 auto" } },
        h("h1", { style: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.9rem", fontWeight: 600, margin: "0 0 4px", color: C.text } }, name),
        draft ? h("p", { style: { margin: "0 0 12px", padding: "8px 14px", borderRadius: "10px", background: "rgba(201,161,79,.14)", color: C.goldSoft, fontSize: "13px" } }, "Включён «Черновик» — на сайте эта карточка НЕ будет показана.") : null,
        h("p", { style: { margin: "0 0 22px", color: C.muted, fontSize: "13px" } },
          urls.length
            ? "Так карточка выглядит на сайте. Фото листаются свайпом, стрелками или по миниатюрам."
            : "Добавьте фото в поле «Фотографии» — они сразу появятся здесь."),

        h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px", alignItems: "start" } },
          h("div", {}, h("p", { style: label }, "В списке котят"), card),
          urls.length ? h("div", {}, h("p", { style: label }, "На странице животного"), h(PageGallery, { urls: urls })) : null
        ),

        (facts.length || description) ? h("div", { style: { marginTop: "28px", padding: "18px 20px", borderRadius: "8px", border: "1px solid " + C.border, background: C.card, fontSize: "14px", lineHeight: 1.8 } },
          facts,
          description ? h("div", { style: { marginTop: facts.length ? "10px" : 0, paddingTop: facts.length ? "10px" : 0, borderTop: facts.length ? "1px solid " + C.border : "none", color: C.muted } }, description) : null
        ) : null
      );
    },
  });

  window.CMS.registerPreviewTemplate("kittens", AnimalPreview);
  window.CMS.registerPreviewTemplate("cats", AnimalPreview);
})();
