/*
 * Виджет «Фотографии» для админки Decap CMS (OrioKerg).
 *
 * Что умеет:
 *  — загрузка сразу НЕСКОЛЬКИХ фото (кнопка или перетаскивание файлов с компьютера);
 *  — большие фото с телефона автоматически уменьшаются перед загрузкой;
 *  — каждое фото показано квадратом ровно так, как его обрежет сайт
 *    (object-fit: cover по центру) — превью видно сразу, ДО публикации;
 *  — порядок меняется перетаскиванием (на телефоне/планшете — стрелками ‹ ›);
 *  — «★ На обложку», удаление, «Отменить»;
 *  — просмотр фото целиком с рамкой того, что попадёт в квадрат карточки.
 *
 * В markdown по-прежнему хранится обычный список путей (photos: [/images/uploads/…]),
 * поэтому сайт и lib/content.ts менять не нужно.
 */
(function () {
  "use strict";

  if (!window.CMS || !window.createClass || !window.h) return;

  var h = window.h;
  var createClass = window.createClass;

  /* publicPath → blob:/data: URL файлов, загруженных в этой сессии админки.
     Общий для виджета и панели «Просмотр», чтобы превью работало до публикации. */
  var cache = (window.OrioPhotoCache = window.OrioPhotoCache || {});

  var MAX_SIDE = 2200; // px по длинной стороне
  var KEEP_AS_IS_BYTES = 1800000; // файлы легче этого и меньше MAX_SIDE не трогаем

  /* ───────────── утилиты ───────────── */

  function toArray(value) {
    if (!value) return [];
    if (typeof value.toJS === "function") value = value.toJS();
    if (!Array.isArray(value)) value = [value];
    return value
      .map(function (item) {
        if (typeof item === "string") return item;
        return item && typeof item === "object" ? item.photo : "";
      })
      .filter(Boolean);
  }

  /* Адрес картинки для показа в админке. Порядок:
     1) файл, загруженный только что (blob);  2) то, что знает Decap (getAsset);
     3) боевой путь — админка живёт на том же домене, что и сайт. */
  function resolveUrl(path, getAsset, field) {
    if (!path) return "";
    if (cache[path]) return cache[path];
    var url = "";
    if (typeof getAsset === "function") {
      try {
        var asset = getAsset(path, field);
        url = asset ? String(asset) : "";
      } catch (e) {
        url = "";
      }
    }
    if (/^(blob:|data:|https?:)/.test(url)) return url;
    return path;
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10);
  }

  function stamp() {
    var d = new Date();
    function p(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return "" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  function plural(n, forms) {
    var a = Math.abs(n) % 100;
    var t = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (t > 1 && t < 5) return forms[1];
    if (t === 1) return forms[0];
    return forms[2];
  }

  /* Уменьшаем тяжёлые фото (телефон отдаёт 5–12 МБ) до 2200 px, JPEG 90%. */
  function prepareFile(file) {
    return new Promise(function (resolve) {
      if (!window.createImageBitmap || /image\/(gif|svg)/.test(file.type)) return resolve(file);
      window
        .createImageBitmap(file, { imageOrientation: "from-image" })
        .then(function (bmp) {
          var scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
          if (scale === 1 && file.size < KEEP_AS_IS_BYTES) {
            if (bmp.close) bmp.close();
            return resolve(file);
          }
          var canvas = document.createElement("canvas");
          canvas.width = Math.round(bmp.width * scale);
          canvas.height = Math.round(bmp.height * scale);
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
          if (bmp.close) bmp.close();
          canvas.toBlob(
            function (blob) {
              // Уменьшали размеры — берём результат всегда; пересжимали без уменьшения — только если легче.
              if (!blob || (scale === 1 && blob.size >= file.size)) return resolve(file);
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.9
          );
        })
        .catch(function () {
          resolve(file);
        });
    });
  }

  /* ───────────── стили ───────────── */

  var css =
    ".og-pg{font-family:Inter,system-ui,sans-serif;color:#2e2620}" +
    ".og-drop{border:2px dashed #cdbf9f;border-radius:14px;padding:22px 16px;text-align:center;background:#fffaf0;color:#7a5c2e;cursor:pointer;transition:all .15s}" +
    ".og-drop:hover,.og-drop.is-over{background:#fff3d6;border-color:#c9a14f}" +
    ".og-drop b{display:block;font-size:15px;margin-bottom:4px}" +
    ".og-drop span{font-size:12.5px;color:#8a7552}" +
    ".og-bar-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 12px}" +
    ".og-count{font-size:13px;color:#6b5d4f;margin-right:auto}" +
    ".og-chip{border:1px solid #d9cfbc;background:#fff;border-radius:999px;padding:7px 14px;font-size:13px;cursor:pointer;color:#2e2620;font-family:inherit}" +
    ".og-chip:hover{border-color:#c9a14f;background:#fffaf0}" +
    ".og-chip.primary{background:#c9a14f;border-color:#c9a14f;color:#20180a;font-weight:600}" +
    ".og-chip.primary:hover{background:#b98f3f}" +
    ".og-chip[disabled]{opacity:.4;cursor:default}" +
    ".og-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-top:12px}" +
    ".og-tile{position:relative;aspect-ratio:1/1;border-radius:12px;overflow:hidden;background:#e8e0d0;border:2px solid #d9cfbc;cursor:grab;user-select:none;-webkit-user-select:none;transition:transform .12s,box-shadow .12s}" +
    ".og-tile:hover{box-shadow:0 4px 16px rgba(0,0,0,.14)}" +
    ".og-tile.is-cover{border-color:#c9a14f;box-shadow:0 0 0 3px rgba(201,161,79,.3)}" +
    ".og-tile.is-over{outline:3px dashed #c9a14f;outline-offset:3px;transform:scale(.97)}" +
    ".og-tile.is-dragging{opacity:.35}" +
    ".og-tile img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;pointer-events:none}" +
    ".og-tile.is-whole{background:#2a2622}" +
    ".og-tile.is-whole img{object-fit:contain}" +
    ".og-whole-tag{position:absolute;right:6px;top:6px;border-radius:12px;padding:3px 9px;background:rgba(32,24,10,.78);color:#f3ead6;font-size:11px}" +
    ".og-tile.is-busy{cursor:default}" +
    ".og-tile.is-busy img{filter:grayscale(.6) brightness(.8)}" +
    ".og-num{position:absolute;left:6px;top:6px;min-width:24px;height:24px;border-radius:12px;padding:0 7px;display:flex;align-items:center;justify-content:center;background:rgba(32,24,10,.78);color:#fff;font-size:12px;font-weight:600}" +
    ".og-cover-tag{position:absolute;right:6px;top:6px;border-radius:12px;padding:3px 9px;background:#c9a14f;color:#20180a;font-size:11px;font-weight:700;letter-spacing:.02em}" +
    ".og-actions{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:5px;padding:18px 6px 6px;background:linear-gradient(transparent,rgba(0,0,0,.7))}" +
    ".og-ib{width:32px;height:32px;border-radius:8px;border:0;background:rgba(255,255,255,.92);color:#2e2620;font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;padding:0}" +
    ".og-ib:hover{background:#fff3d6}" +
    ".og-ib.danger:hover{background:#ffd9d4;color:#a3281a}" +
    ".og-ib[disabled]{opacity:.35;cursor:default}" +
    ".og-add{aspect-ratio:1/1;border:2px dashed #cdbf9f;border-radius:12px;background:#fffaf0;color:#7a5c2e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;font-size:13px;font-family:inherit;padding:0}" +
    ".og-add:hover{background:#fff3d6;border-color:#c9a14f}" +
    ".og-add i{font-style:normal;font-size:30px;line-height:1}" +
    ".og-status{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;color:#fff;font-size:12px;text-align:center;padding:8px;background:rgba(0,0,0,.25)}" +
    ".og-spin{width:26px;height:26px;border-radius:50%;border:3px solid rgba(255,255,255,.35);border-top-color:#fff;animation:og-rot .8s linear infinite}" +
    "@keyframes og-rot{to{transform:rotate(360deg)}}" +
    ".og-broken{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font-size:12px;color:#8a7552;background:#efe7d6}" +
    ".og-err{margin:10px 0 0;padding:10px 12px;border-radius:10px;background:#fdecea;border:1px solid #f2b8b0;color:#8c2a1d;font-size:13px}" +
    ".og-tip{margin:12px 0 0;font-size:12.5px;line-height:1.55;color:#7a6c58}" +
    ".og-lb{margin-top:14px;padding:16px;border-radius:14px;background:#17130d;display:flex;flex-direction:column;align-items:center;gap:12px}" +
    ".og-lb-stage{position:relative;display:inline-block;line-height:0;max-width:100%;overflow:hidden;border-radius:4px}" +
    ".og-lb-stage img{max-width:100%;max-height:70vh;display:block;border-radius:4px}" +
    ".og-crop{position:absolute;border:2px dashed #e7cf8b;box-shadow:0 0 0 9999px rgba(10,8,5,.62);pointer-events:none;box-sizing:border-box}" +
    ".og-lb-cap{color:#f3ead6;font-size:13px;text-align:center;line-height:1.5;max-width:560px}" +
    ".og-lb-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}" +
    ".og-lb .og-chip{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);color:#fff}" +
    ".og-lb .og-chip:hover{background:rgba(255,255,255,.22)}";

  function injectStyles() {
    if (document.getElementById("og-photo-styles")) return;
    var el = document.createElement("style");
    el.id = "og-photo-styles";
    el.appendChild(document.createTextNode(css));
    document.head.appendChild(el);
  }

  /* ───────────── редактор ───────────── */

  var PhotoGalleryControl = createClass({
    getInitialState: function () {
      injectStyles();
      this.history = [];
      this.latest = [];
      this.controlID = "og-photos-" + uid();
      return {
        busy: [], // загрузки в процессе: {id, preview, state: "wait"|"work"|"error", message}
        error: "",
        fileOver: false,
        dragIndex: null,
        overIndex: null,
        lightbox: null,
        natural: null, // {w,h} открытого в просмотре фото
        broken: {},
        canUndo: false,
      };
    },

    /* По умолчанию Decap перерисовывает контрол только при смене value —
       тогда выбор из библиотеки файлов (mediaPaths) до нас не дошёл бы. */
    shouldComponentUpdate: function () {
      return true;
    },

    componentDidMount: function () {
      this._onKey = this.onKey;
      document.addEventListener("keydown", this._onKey);
    },

    componentWillUnmount: function () {
      document.removeEventListener("keydown", this._onKey);
      this.unmounted = true;
    },

    /* Фото, выбранные в стандартной библиотеке файлов Decap. */
    componentDidUpdate: function () {
      var paths = this.props.mediaPaths;
      var picked = paths && paths.get ? paths.get(this.controlID) : null;
      if (!picked) return;
      var added = toArray(picked);
      if (this.props.onRemoveInsertedMedia) this.props.onRemoveInsertedMedia(this.controlID);
      var current = this.latest.slice();
      added.forEach(function (p) {
        if (current.indexOf(p) === -1) current.push(p);
      });
      this.commit(current);
    },

    getPhotos: function () {
      return toArray(this.props.value);
    },

    /* Записываем новый список (с историей для «Отменить»). */
    commit: function (next, skipHistory) {
      if (!skipHistory) {
        this.history.push(this.latest.slice());
        if (this.history.length > 30) this.history.shift();
      }
      this.latest = next;
      this.props.onChange(next);
      if (!this.unmounted) this.setState({ canUndo: this.history.length > 0, error: "" });
    },

    undo: function () {
      if (!this.history.length) return;
      var prev = this.history.pop();
      this.commit(prev, true);
    },

    move: function (from, to) {
      var list = this.latest.slice();
      if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
      var item = list.splice(from, 1)[0];
      list.splice(to, 0, item);
      this.commit(list);
    },

    remove: function (index) {
      var list = this.latest.slice();
      list.splice(index, 1);
      this.commit(list);
      this.setState({ lightbox: null });
    },

    onKey: function (e) {
      if (this.state.lightbox === null) return;
      var tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") this.closeLightbox();
      else if (e.key === "ArrowLeft") this.stepLightbox(-1);
      else if (e.key === "ArrowRight") this.stepLightbox(1);
    },

    openLightbox: function (index) {
      var self = this;
      this.setState({ lightbox: index, natural: null });
      setTimeout(function () {
        if (self.lbEl && self.lbEl.scrollIntoView) self.lbEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 60);
    },
    closeLightbox: function () {
      this.setState({ lightbox: null, natural: null });
    },
    stepLightbox: function (dir) {
      var next = this.state.lightbox + dir;
      if (next < 0 || next >= this.latest.length) return;
      this.setState({ lightbox: next, natural: null });
    },

    /* ── загрузка ── */

    pickFiles: function () {
      if (this.fileInput) this.fileInput.click();
    },

    openLibrary: function () {
      if (!this.props.onOpenMediaLibrary) return;
      this.props.onOpenMediaLibrary({
        controlID: this.controlID,
        forImage: true,
        privateUpload: false,
        allowMultiple: true,
        field: this.props.field,
      });
    },

    uploadFiles: function (fileList) {
      var self = this;
      var all = Array.prototype.slice.call(fileList || []);
      var files = all.filter(function (f) {
        return /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name);
      });
      if (!files.length) {
        if (all.length) this.setState({ error: "Это не изображение. Подойдут файлы JPG, PNG или WebP." });
        return;
      }
      if (files.length < all.length) {
        this.setState({ error: "Часть файлов пропущена — это не изображения." });
      }

      var cfg = this.props.config;
      var publicFolder = ((cfg && cfg.get && cfg.get("public_folder")) || "/images/uploads").replace(/\/$/, "");

      var items = files.map(function (file) {
        return { id: uid(), file: file, preview: URL.createObjectURL(file) };
      });
      this.setState({
        busy: this.state.busy.concat(
          items.map(function (it) {
            return { id: it.id, preview: it.preview, state: "wait", message: "В очереди" };
          })
        ),
      });

      /* По одному: так надёжнее для коммитов в репозиторий и порядок фото сохраняется. */
      items
        .reduce(function (chain, item) {
          return chain.then(function () {
            return self.uploadOne(item, publicFolder);
          });
        }, Promise.resolve())
        .then(function () {
          setTimeout(function () {
            if (self.unmounted) return;
            self.setState({
              busy: self.state.busy.filter(function (b) {
                return b.state === "error";
              }),
            });
          }, 0);
        });
    },

    setBusy: function (id, patch) {
      if (this.unmounted) return;
      this.setState({
        busy: this.state.busy.map(function (b) {
          return b.id === id ? Object.assign({}, b, patch) : b;
        }),
      });
    },

    uploadOne: function (item, publicFolder) {
      var self = this;
      self.setBusy(item.id, { state: "work", message: "Загружаем…" });

      return prepareFile(item.file).then(function (prepared) {
        var ext = (prepared.name.match(/\.([a-z0-9]+)$/i) || [null, "jpg"])[1].toLowerCase();
        if (ext === "jpeg") ext = "jpg";
        var name = "photo-" + stamp() + "-" + uid().slice(0, 4) + "." + ext;
        var renamed = new File([prepared], name, { type: prepared.type || "image/jpeg" });
        var previewUrl = prepared === item.file ? item.preview : URL.createObjectURL(renamed);

        return Promise.resolve(self.props.onPersistMedia(renamed, { field: self.props.field }))
          .then(function (res) {
            if (res && res.type === "MEDIA_PERSIST_FAILURE") throw new Error("persist failed");
            var real = res && res.payload && res.payload.file && res.payload.file.path;
            var fileName = real ? real.split("/").pop() : name;
            var publicPath = publicFolder + "/" + fileName;
            cache[publicPath] = previewUrl;
            self.latest = self.latest.length ? self.latest : self.getPhotos();
            self.commit(self.latest.concat([publicPath]));
            self.setBusy(item.id, { state: "done" });
          })
          .catch(function () {
            self.setBusy(item.id, {
              state: "error",
              message: "Не удалось загрузить. Попробуйте ещё раз.",
            });
          });
      });
    },

    dismissBusy: function (id) {
      this.setState({
        busy: this.state.busy.filter(function (b) {
          return b.id !== id;
        }),
      });
    },

    /* ── drag & drop ── */

    isFileDrag: function (e) {
      var types = e.dataTransfer && e.dataTransfer.types;
      if (!types) return false;
      for (var i = 0; i < types.length; i++) if (types[i] === "Files") return true;
      return false;
    },

    onContainerDragOver: function (e) {
      if (!this.isFileDrag(e)) return;
      e.preventDefault();
      if (!this.state.fileOver) this.setState({ fileOver: true });
    },
    onContainerDragLeave: function (e) {
      if (!this.isFileDrag(e)) return;
      if (e.currentTarget.contains(e.relatedTarget)) return;
      this.setState({ fileOver: false });
    },
    onContainerDrop: function (e) {
      if (!this.isFileDrag(e)) return;
      e.preventDefault();
      this.setState({ fileOver: false });
      this.uploadFiles(e.dataTransfer.files);
    },

    /* ── отрисовка ── */

    renderTile: function (path, index, total) {
      var self = this;
      var url = resolveUrl(path, this.props.getAsset, this.props.field);
      var isCover = index === 0;
      var cls = "og-tile" + (isCover ? " is-cover" : " is-whole");
      if (this.state.dragIndex === index) cls += " is-dragging";
      if (this.state.overIndex === index && this.state.dragIndex !== null && this.state.dragIndex !== index) cls += " is-over";
      var broken = this.state.broken[path];

      return h(
        "div",
        {
          key: path + "#" + index,
          className: cls,
          draggable: true,
          title: "Перетащите, чтобы изменить порядок",
          onDragStart: function (e) {
            e.dataTransfer.effectAllowed = "move";
            try {
              e.dataTransfer.setData("text/plain", "og:" + index);
            } catch (err) {}
            self.setState({ dragIndex: index });
          },
          onDragOver: function (e) {
            if (self.state.dragIndex === null) return;
            e.preventDefault();
            if (self.state.overIndex !== index) self.setState({ overIndex: index });
          },
          onDrop: function (e) {
            if (self.state.dragIndex === null) return;
            e.preventDefault();
            e.stopPropagation();
            var from = self.state.dragIndex;
            self.setState({ dragIndex: null, overIndex: null });
            self.move(from, index);
          },
          onDragEnd: function () {
            self.setState({ dragIndex: null, overIndex: null });
          },
        },
        broken
          ? h("div", { className: "og-broken" }, "Фото не найдено на сайте. Удалите его и загрузите заново.")
          : h("img", {
              src: url,
              alt: "Фото " + (index + 1),
              draggable: false,
              onError: function () {
                var next = Object.assign({}, self.state.broken);
                next[path] = true;
                self.setState({ broken: next });
              },
            }),
        h("span", { className: "og-num" }, String(index + 1)),
        isCover ? h("span", { className: "og-cover-tag" }, "★ ОБЛОЖКА") : h("span", { className: "og-whole-tag" }, "целиком"),
        h(
          "div",
          { className: "og-actions" },
          h("button", { type: "button", className: "og-ib", title: "Сдвинуть левее", disabled: index === 0, onClick: function () { self.move(index, index - 1); } }, "‹"),
          h("button", { type: "button", className: "og-ib", title: "Сдвинуть правее", disabled: index === total - 1, onClick: function () { self.move(index, index + 1); } }, "›"),
          !isCover ? h("button", { type: "button", className: "og-ib", title: "Сделать обложкой (первое фото)", onClick: function () { self.move(index, 0); } }, "★") : null,
          h("button", { type: "button", className: "og-ib", title: "Посмотреть целиком", onClick: function () { self.openLightbox(index); } }, "⌕"),
          h("button", { type: "button", className: "og-ib danger", title: "Убрать из карточки", onClick: function () { self.remove(index); } }, "✕")
        )
      );
    },

    renderBusyTile: function (b) {
      var self = this;
      var isError = b.state === "error";
      return h(
        "div",
        { key: b.id, className: "og-tile is-busy" },
        h("img", { src: b.preview, alt: "", draggable: false }),
        h(
          "div",
          { className: "og-status" },
          isError ? null : h("div", { className: "og-spin" }),
          h("div", {}, b.message),
          isError ? h("button", { type: "button", className: "og-chip", onClick: function () { self.dismissBusy(b.id); } }, "Убрать") : null
        )
      );
    },

    renderLightbox: function (photos) {
      var self = this;
      var index = this.state.lightbox;
      if (index === null || !photos[index]) return null;
      var path = photos[index];
      var url = resolveUrl(path, this.props.getAsset, this.props.field);
      var n = this.state.natural;

      /* Рамка квадрата, который попадёт на сайт: центр фото, сторона = меньшая сторона. */
      var crop = null;
      if (index === 0 && n && n.w && n.h) {
        if (n.w > n.h) {
          var wPct = (n.h / n.w) * 100;
          crop = { left: (100 - wPct) / 2 + "%", top: "0", width: wPct + "%", height: "100%" };
        } else {
          var hPct = (n.w / n.h) * 100;
          crop = { left: "0", top: (100 - hPct) / 2 + "%", width: "100%", height: hPct + "%" };
        }
      }
      var fits = n && Math.abs(n.w - n.h) < 2;
      var isCover = index === 0;

      return h(
        "div",
        { className: "og-lb", ref: function (el) { self.lbEl = el; } },
        h(
          "div",
          { className: "og-lb-stage" },
          h("img", {
            src: url,
            alt: "",
            onLoad: function (e) {
              self.setState({ natural: { w: e.target.naturalWidth, h: e.target.naturalHeight } });
            },
          }),
          crop ? h("div", { className: "og-crop", style: crop }) : null
        ),
        h(
          "div",
          { className: "og-lb-cap" },
          "Фото " + (index + 1) + " из " + photos.length + (index === 0 ? " · обложка" : ""),
          h("br"),
          !isCover
            ? "Дополнительное фото — на сайте показывается целиком, без обрезки."
            : fits
              ? "Фото квадратное — на сайте видно целиком."
              : "Яркая часть в рамке — это то, что увидят на сайте на обложке (квадрат по центру). Затемнённое — обрезается."
        ),
        h(
          "div",
          { className: "og-lb-row" },
          h("button", { type: "button", className: "og-chip", disabled: index === 0, onClick: function () { self.stepLightbox(-1); } }, "‹ Назад"),
          index !== 0 ? h("button", { type: "button", className: "og-chip", onClick: function () { self.move(index, 0); self.closeLightbox(); } }, "★ На обложку") : null,
          h("button", { type: "button", className: "og-chip", disabled: index === photos.length - 1, onClick: function () { self.stepLightbox(1); } }, "Вперёд ›"),
          h("button", { type: "button", className: "og-chip", onClick: function () { self.closeLightbox(); } }, "Закрыть")
        )
      );
    },

    render: function () {
      var self = this;
      var photos = (this.latest = this.getPhotos());
      var busy = this.state.busy;
      var empty = photos.length === 0 && busy.length === 0;

      var fileInput = h("input", {
        type: "file",
        accept: "image/*",
        multiple: true,
        style: { display: "none" },
        ref: function (el) {
          self.fileInput = el;
        },
        onChange: function (e) {
          var picked = Array.prototype.slice.call(e.target.files || []);
          e.target.value = "";
          self.uploadFiles(picked);
        },
      });

      var summary = photos.length
        ? photos.length + " " + plural(photos.length, ["фото", "фото", "фото"]) + " · первое — обложка"
        : "Пока нет фотографий";

      return h(
        "div",
        {
          className: "og-pg",
          id: this.props.forID,
          onDragOver: this.onContainerDragOver,
          onDragLeave: this.onContainerDragLeave,
          onDrop: this.onContainerDrop,
        },
        fileInput,
        empty
          ? h(
              "div",
              { className: "og-drop" + (this.state.fileOver ? " is-over" : ""), onClick: this.pickFiles },
              h("b", {}, "📷 Добавить фотографии"),
              h("span", {}, "Перетащите файлы сюда или нажмите. Можно выбрать сразу несколько.")
            )
          : h(
              "div",
              {},
              h(
                "div",
                { className: "og-bar-top" },
                h("span", { className: "og-count" }, summary),
                h("button", { type: "button", className: "og-chip primary", onClick: this.pickFiles }, "+ Добавить фото"),
                this.props.onOpenMediaLibrary ? h("button", { type: "button", className: "og-chip", onClick: this.openLibrary }, "Из загруженных") : null,
                this.state.canUndo ? h("button", { type: "button", className: "og-chip", onClick: this.undo }, "↩ Отменить") : null
              ),
              h(
                "div",
                { className: "og-grid", style: this.state.fileOver ? { outline: "3px dashed #c9a14f", outlineOffset: "6px", borderRadius: "8px" } : null },
                photos.map(function (p, i) {
                  return self.renderTile(p, i, photos.length);
                }),
                busy.map(function (b) {
                  return self.renderBusyTile(b);
                }),
                h("button", { type: "button", className: "og-add", onClick: this.pickFiles }, h("i", {}, "+"), "Добавить")
              )
            ),
        this.state.error ? h("div", { className: "og-err" }, this.state.error) : null,
        h(
          "p",
          { className: "og-tip" },
          "Первое фото — обложка: на сайте оно квадратное (обрезается по центру), плитка показывает точную обрезку. Остальные фото показываются целиком. Если на обложке обрезаны уши или лапы — поставьте другой кадр (★). ",
          "Порядок меняется перетаскиванием или стрелками ‹ ›. Кнопка ⌕ показывает фото целиком (у обложки — с рамкой обрезки)."
        ),
        this.renderLightbox(photos)
      );
    },
  });

  /* Панель «Просмотр» для самого виджета не нужна (карточку рисует animal-preview.js). */
  var PhotoGalleryPreview = createClass({
    render: function () {
      var photos = toArray(this.props.value);
      var getAsset = this.props.getAsset;
      return h(
        "div",
        { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
        photos.map(function (p, i) {
          return h("img", { key: i, src: resolveUrl(p, getAsset), style: { width: "96px", height: "96px", objectFit: "cover", borderRadius: "8px" } });
        })
      );
    },
  });

  window.CMS.registerWidget("photo-gallery", PhotoGalleryControl, PhotoGalleryPreview);

  /* Общие хелперы для animal-preview.js */
  window.OrioPhotos = { toArray: toArray, resolveUrl: resolveUrl, plural: plural };
})();
