# N-a-Y

A small three-page static site: an apology, a short journey, and a thank-you.

| Page | File | What happens |
| --- | --- | --- |
| 1 | `index.html` | Just "I'm Sorry." and a **Next** button to page 2. |
| 2 | `journey.html` | A trail map with three stops: a gift box to tap open (the shirt photo), the video with its side note, and the birthday photo captioned with the wish. Below it, a class 9 maths problem locks the Myntra drop-box, **Do you miss me?** and the **Yes** button. Pressing **Yes** submits the link. |
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

## Getting the Myntra link emailed to you

When she presses **Yes**, the page can quietly email you the link she dropped or pasted. Nothing on the page changes.

1. Go to https://web3forms.com, enter your email and click **Create Access Key**. The key arrives in your inbox.
2. Open `js/journey.js` and paste it between the quotes on this line near the top:
   ```js
   var WEB3FORMS_KEY = "";
   ```
3. Commit and push. Each **Yes** now sends you an email with the link, the time and her device.

While the key is empty, nothing is sent anywhere. The access key is designed to be public, so it's fine in the code. Anyone who finds it could only send emails to your own inbox.
