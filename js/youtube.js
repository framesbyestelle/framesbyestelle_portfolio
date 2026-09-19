/* ==========================================================
   framesbyestelle — YouTube player + video grid
   ----------------------------------------------------------
   To add a new video: paste a new line at the TOP of VIDEOS
   (newest first). The id is the part after "v=" in the video's
   URL. Nothing else needs to change.
   ========================================================== */

(function () {
  'use strict';

  const VIDEOS = [
    { id: 'mFz5WfPnOXY', title: 'why solo travel changes you',                              date: '2026-09-13' },
    { id: 'fOZ1Byn34Zc', title: 'why you should plan trips in your 20s',                    date: '2026-07-12' },
    { id: '4JS8u-mi1Hw', title: 'starting over in your 20s',                                date: '2026-06-18' },
    { id: 'yVFa4z4uOfk', title: 'why you should go on a spontaneous trip',                  date: '2026-05-18' },
    { id: 'm9Bi26qeQqI', title: 'How to Make Cinematic Videos At Home',                     date: '2026-05-06' },
    { id: 'BTlQNzDdJ2o', title: 'how to stay close when life pulls you in different directions', date: '2026-04-11' },
    { id: 'tUchogdIvQQ', title: 'when a life chapter ends',                                 date: '2026-03-30' },
    { id: 'sQecENvYRsg', title: 'the moments you can’t get back',                      date: '2026-03-21' },
    { id: '-LgiG820QRk', title: 'take the trip before the moment passes',                   date: '2026-03-05' },
    { id: '87Ib_1Ile6A', title: 'why you need a creative outlet in your 20s',               date: '2026-02-23' },
    { id: 'iSL0DLYY9rk', title: 'why I picked up my grandma’s 1980s film camera',      date: '2026-02-12' },
    { id: 'rFOB21RBi1M', title: 'what my walls say about me',                               date: '2026-01-27' },
    { id: 'p8oUKC8sS14', title: 'why you should make time for those who cross your path',   date: '2026-01-20' },
    { id: 'yo5KBCrg9Vw', title: 'so, you want to be creative?',                             date: '2026-01-12' },
    { id: 'kXTSTapwJ84', title: 'how to document your memories',                            date: '2026-01-05' }
  ];

  const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  const thumbUrl    = (id) => 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
  const fallbackUrl = (id) => 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  const watchUrl    = (id) => 'https://www.youtube.com/watch?v=' + id;
  const embedUrl    = (id) => 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
                              '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  const monthYear   = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function thumbImg(video) {
    const img = el('img');
    img.src = thumbUrl(video.id);
    img.alt = '';
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      img.onerror = null;
      img.src = fallbackUrl(video.id);
    });
    return img;
  }

  document.querySelectorAll('[data-yt]').forEach(function (root) {
    const thumbs   = parseInt(root.dataset.thumbs || '6', 10);
    const order    = VIDEOS.slice(0, thumbs + 1);
    const playerEl = root.querySelector('[data-yt-player]');
    const nowEl    = root.querySelector('[data-yt-now]');
    const gridEl   = root.querySelector('[data-yt-grid]');
    if (!playerEl || !order.length) return;

    function renderNow(video) {
      if (!nowEl) return;
      nowEl.textContent = '';
      nowEl.appendChild(el('h3', 'yt-now-title', video.title));
      const meta = el('div', 'yt-now-meta');
      meta.appendChild(el('span', 'yt-now-date', monthYear(video.date)));
      const link = el('a', 'yt-now-link', 'Watch on YouTube ↗');
      link.href = watchUrl(video.id);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      meta.appendChild(link);
      nowEl.appendChild(meta);
    }

    function renderPlayer(video, autoplay) {
      playerEl.textContent = '';
      if (autoplay) {
        const frame = el('iframe');
        frame.src = embedUrl(video.id);
        frame.title = video.title;
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
        playerEl.appendChild(frame);
      } else {
        const facade = el('button', 'yt-facade');
        facade.type = 'button';
        facade.setAttribute('aria-label', 'Play video: ' + video.title);
        facade.appendChild(thumbImg(video));
        const play = el('span', 'yt-play');
        play.innerHTML = PLAY_ICON;
        facade.appendChild(play);
        facade.addEventListener('click', function () { renderPlayer(video, true); });
        playerEl.appendChild(facade);
      }
      renderNow(video);
    }

    function renderGrid() {
      if (!gridEl) return;
      gridEl.textContent = '';
      order.slice(1).forEach(function (video, i) {
        const card = el('button', 'yt-card');
        card.type = 'button';
        card.setAttribute('aria-label', 'Play video: ' + video.title);
        const thumb = el('span', 'yt-card-thumb');
        thumb.appendChild(thumbImg(video));
        const overlay = el('span', 'yt-card-play');
        overlay.innerHTML = PLAY_ICON;
        thumb.appendChild(overlay);
        card.appendChild(thumb);
        card.appendChild(el('span', 'yt-card-title', video.title));
        card.appendChild(el('span', 'yt-card-date', monthYear(video.date)));
        card.addEventListener('click', function () {
          const clicked = i + 1;
          const tmp = order[0];
          order[0] = order[clicked];
          order[clicked] = tmp;
          renderPlayer(order[0], true);
          renderGrid();
          playerEl.scrollIntoView({ block: 'center' });
        });
        gridEl.appendChild(card);
      });
    }

    renderPlayer(order[0], false);
    renderGrid();
  });
})();
