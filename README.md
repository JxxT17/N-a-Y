# N-a-Y

A small three-page static site: an apology, a short journey, and a thank-you.

| Page | File | What happens |
| --- | --- | --- |
| 1 | `index.html` | Just "I'm Sorry." and a **Next** button to page 2. |
| 2 | `journey.html` | A trail map with three stops: a gift box to tap open (the shirt photo), the video with its side note, and the birthday photo captioned with the wish. Below it, a class 9 maths problem locks the Myntra drop-box, **you miss me?** and the **Yes** button. Pressing **Yes** submits the link. |
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
