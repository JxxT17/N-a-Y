# N-a-Y

A small three-page static site: an apology, a short journey, and a thank-you.

| Page | File | What happens |
| --- | --- | --- |
| 1 | `index.html` | The apology letter and the promise to be more mindful. |
| 2 | `journey.html` | A trail map with three stops: a **Surprise** box to tap open (photo 1), the video with its side note (stop 2), and a photo locked behind a class 9 maths problem (stop 3). Unlocking it shows the Myntra drop-box. After a link is dropped, **Do you miss me?** and **Yes** appear. |
| 3 | `thanks.html` | The thank-you page, reached by pressing **Yes**. If a Myntra link was dropped, it offers a button to send that link back. |

## Run it locally

No build step. Serve the folder and open it in a browser:

```bash
python3 -m http.server 8000
```

Then go to http://localhost:8000.

## Put it online (GitHub Pages)

Repo **Settings → Pages → Build and deployment → Deploy from a branch**. Pick the branch and the `/ (root)` folder. The site is published at `https://<user>.github.io/N-a-Y/`.

## Editing

- Wording lives directly in the three HTML files.
- The maths problems and wrong-answer messages are in `js/journey.js` (`PROBLEMS`, `NOPES`).
- Media: `assets/img/stop1-surprise.webp`, `assets/video/stop2-exhibit-a.mp4`, `assets/img/stop3-locked.webp`.
- The site has no backend. The dropped Myntra link is only passed to the thank-you page in the URL.
